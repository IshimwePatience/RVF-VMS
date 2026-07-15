import React, { useState, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, MapPin, Pencil, Trash2, X, Search, Download } from 'lucide-react';
import MapModal from '../../components/MapModal';
import CertificateCard from '../../components/CertificateCard';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import LocationDropdown from '../../components/LocationDropdown';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ViewResultsTab({ isLabPortal, filters, veterinaryPhone, onFilteredDataChange }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [mapLocationData, setMapLocationData] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const certificateRef = React.useRef(null);
  const [certData, setCertData] = useState(null);
  
  const [localFilters, setLocalFilters] = useState({
    district: '',
    sector: '',
    cell: '',
    village: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const { data: surveillanceForms = [] } = useQuery({
    queryKey: ['surveillance-forms-for-vets', veterinaryPhone],
    queryFn: async () => {
      const url = veterinaryPhone ? `/rvf-api/surveillance?phone=${encodeURIComponent(veterinaryPhone)}` : '/rvf-api/surveillance';
      const res = await axios.get(url);
      return res.data;
    },
    enabled: !isLabPortal // Only fetch if we are in Reports
  });

  const animalIdToVetMap = useMemo(() => {
    const map = {};
    surveillanceForms.forEach(form => {
      if (form.samples && Array.isArray(form.samples)) {
        form.samples.forEach(sample => {
          if (sample.animal_id) {
            map[sample.animal_id] = { name: form.submitted_by, phone: form.veterinary_email || form.phone_number };
          }
        });
      }
    });
    return map;
  }, [surveillanceForms]);

  const { data: results = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['lab-results', veterinaryPhone],
    queryFn: async () => {
      const url = veterinaryPhone ? `/rvf-api/lab-results?vet_phone=${encodeURIComponent(veterinaryPhone)}` : '/rvf-api/lab-results';
      
      const token = localStorage.getItem('token') || localStorage.getItem('daro_token') || localStorage.getItem('lab_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(url, { headers });
      return res.data;
    }
  });

  const filteredResults = useMemo(() => {
    const activeFilters = isLabPortal ? localFilters : filters;
    
    let baseResults = results;
    if (!isLabPortal && veterinaryPhone) {
      const seen = new Set();
      baseResults = results.filter(r => {
        if (!animalIdToVetMap[r.animal_id]) return false;
        if (seen.has(r.animal_id)) return false;
        seen.add(r.animal_id);
        return true;
      });
    }

    return baseResults.filter(r => {
      if (activeFilters?.district && activeFilters.district.length > 0) {
        const dists = Array.isArray(activeFilters.district) ? activeFilters.district.map(d => d.toLowerCase()) : [String(activeFilters.district).toLowerCase()];
        const rDist1 = String(r.animal_district_origin || '').toLowerCase();
        const rDist2 = String(r.district || '').toLowerCase();
        if (!dists.includes(rDist1) && !dists.includes(rDist2)) return false;
      }
      if (activeFilters?.sector && activeFilters.sector.length > 0) {
        const sectors = Array.isArray(activeFilters.sector) ? activeFilters.sector.map(s => s.toLowerCase()) : [String(activeFilters.sector).toLowerCase()];
        if (!sectors.includes(String(r.sector || '').toLowerCase())) return false;
      }
      if (activeFilters?.cell && String(r.cell || '').toLowerCase() !== String(activeFilters.cell).toLowerCase()) return false;
      if (activeFilters?.village && String(r.village || '').toLowerCase() !== String(activeFilters.village).toLowerCase()) return false;
      
      const searchTerm = activeFilters?.search;
      if (searchTerm) {
        const searchVal = searchTerm.toLowerCase();
        if (!JSON.stringify(r).toLowerCase().includes(searchVal)) return false;
      }
      if (activeFilters?.dateFrom) {
         const fromDateStr = activeFilters.timeFrom ? `${activeFilters.dateFrom}T${activeFilters.timeFrom}:00` : activeFilters.dateFrom;
         if (new Date(r.createdAt) < new Date(fromDateStr)) return false;
      }
      if (activeFilters?.dateTo) {
         const toDateStr = activeFilters.timeTo ? `${activeFilters.dateTo}T${activeFilters.timeTo}:59` : `${activeFilters.dateTo}T23:59:59`;
         if (new Date(r.createdAt) > new Date(toDateStr)) return false;
      }
      if (activeFilters?.purpose && activeFilters.purpose.length > 0) {
        const purposes = Array.isArray(activeFilters.purpose) ? activeFilters.purpose.map(p => p.toLowerCase()) : [String(activeFilters.purpose).toLowerCase()];
        if (!purposes.includes(String(r.purpose || '').trim().toLowerCase())) return false;
      }
      if (activeFilters?.pcr_result && activeFilters.pcr_result.length > 0) {
        const results = Array.isArray(activeFilters.pcr_result) ? activeFilters.pcr_result.map(p => p.toLowerCase()) : [String(activeFilters.pcr_result).toLowerCase()];
        if (!results.includes(String(r.rvf_pcr_results || '').trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [results, filters, localFilters, isLabPortal]);

  // Use a ref to store the latest callback to avoid unnecessary dependency changes
  const onFilteredDataChangeRef = React.useRef(onFilteredDataChange);
  React.useEffect(() => {
    onFilteredDataChangeRef.current = onFilteredDataChange;
  }, [onFilteredDataChange]);

  React.useEffect(() => {
    if (onFilteredDataChangeRef.current) {
      onFilteredDataChangeRef.current(filteredResults);
    }
  }, [filteredResults]);

  const pagination = usePagination(filteredResults || [], 10);

  const handleDownloadCertificate = async (result) => {
    setDownloadingId(result.id);
    setCertData(result);
    // Wait for the hidden component to render
    setTimeout(async () => {
      try {
        const element = certificateRef.current;
        if (!element) throw new Error("Certificate element not found");
        
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [800, 500]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 500);
        pdf.save(`RAB_RVF_Certificate_${result.animal_id || result.id}.pdf`);
      } catch (err) {
        console.error("Error generating certificate", err);
      } finally {
        setDownloadingId(null);
        setCertData(null);
      }
    }, 100);
  };

  return (
    <>
      <div className="space-y-6">
        {isLabPortal && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search farmer or animal ID..."
                  value={localFilters.search}
                  onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="w-40">
              <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                <LocationDropdown 
                  type="districts"
                  value={localFilters.district}
                  onChange={(val) => setLocalFilters({ ...localFilters, district: val, sector: '', cell: '', village: '' })}
                  placeholder="District"
                />
              </div>
            </div>
            <div className="w-40">
              <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                <LocationDropdown 
                  type="sectors"
                  params={{ district: localFilters.district }}
                  value={localFilters.sector}
                  onChange={(val) => setLocalFilters({ ...localFilters, sector: val, cell: '', village: '' })}
                  placeholder="Sector"
                />
              </div>
            </div>
            <div className="w-40">
              <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                <LocationDropdown 
                  type="cells"
                  params={{ district: localFilters.district, sector: localFilters.sector }}
                  value={localFilters.cell}
                  onChange={(val) => setLocalFilters({ ...localFilters, cell: val, village: '' })}
                  placeholder="Cell"
                />
              </div>
            </div>
            <div className="w-40">
              <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                <LocationDropdown 
                  type="villages"
                  params={{ district: localFilters.district, sector: localFilters.sector, cell: localFilters.cell }}
                  value={localFilters.village}
                  onChange={(val) => setLocalFilters({ ...localFilters, village: val })}
                  placeholder="Village"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={localFilters.dateFrom}
                onChange={e => setLocalFilters({...localFilters, dateFrom: e.target.value})}
                className="w-36 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-600"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date"
                value={localFilters.dateTo}
                onChange={e => setLocalFilters({...localFilters, dateTo: e.target.value})}
                className="w-36 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-600"
              />
            </div>
            {(localFilters.search || localFilters.district || localFilters.dateFrom || localFilters.dateTo) && (
              <button 
                onClick={() => setLocalFilters({ district: '', sector: '', cell: '', village: '', dateFrom: '', dateTo: '', search: '' })}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {(!isLoading && filteredResults.length === 0) ? (
        <div className="py-20 flex flex-col items-center justify-center text-center mt-2">
          <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No data" className="h-40 object-contain mb-6 opacity-75" />
          <p className="text-[15px] font-medium text-slate-500">No reports found</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            {results.length === 0 ? "You don't have any lab results yet." : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
          {(!isLoading && results.length > 0) && (
            <thead className="border-b border-slate-200">
              <tr>
                {!isLabPortal && (
                  <>
                    <th className="py-4 px-6 font-semibold text-slate-800">Lab Technician Name</th>
                    <th className="py-4 px-6 font-semibold text-slate-800">Technician Number</th>
                  </>
                )}
                <th className="py-4 px-6 font-semibold text-slate-800">Date Uploaded</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Tested Site</th>
                {!isLabPortal && (
                  <th className="py-4 px-6 font-semibold text-slate-800">Veterinary (Result Owner)</th>
                )}
                <th className="py-4 px-6 font-semibold text-slate-800">Farmer</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Location</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Animal ID</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Specie</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Breed</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Sex</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Age</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Vacc. Status</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Purpose</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Health Status</th>
                <th className="py-4 px-6 font-semibold text-slate-800">PCR Result</th>
                <th className="py-4 px-6 font-semibold text-slate-800 text-right">Actions</th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={user?.role === 'Lab User' ? 13 : 12} className="py-12 text-center text-slate-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading results...
                </td>
              </tr>
            ) : (
              pagination.currentData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100 transition-colors group">
                  {!isLabPortal && (
                    <>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {r.uploader?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {r.uploader?.phone_number || 'N/A'}
                      </td>
                    </>
                  )}
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {r.tested_site || 'N/A'}
                  </td>
                  {!isLabPortal && (
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{animalIdToVetMap[r.animal_id]?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{animalIdToVetMap[r.animal_id]?.phone || ''}</div>
                    </td>
                  )}
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{r.farmer_name || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{r.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">
                          {r.village || r.cell || r.sector || (r.district || r.animal_district_origin) || 'Unknown Location'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {[(r.district || r.animal_district_origin), r.sector, r.cell].filter(Boolean).filter(x => x !== (r.village || r.cell || r.sector || (r.district || r.animal_district_origin))).join(' / ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {r.animal_id || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.specie || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.breed || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.sex || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.age || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.vaccination_status || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.purpose || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.health_status || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                      r.rvf_pcr_results?.toUpperCase().includes('POSITIVE') 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {r.rvf_pcr_results ? r.rvf_pcr_results.trim().charAt(0).toUpperCase() + r.rvf_pcr_results.trim().slice(1).toLowerCase() : 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleDownloadCertificate(r)}
                        disabled={downloadingId === r.id}
                        className={`p-1.5 rounded-md transition-colors ${downloadingId === r.id ? 'text-slate-400 bg-slate-50' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                        title="Download Certificate"
                      >
                        {downloadingId === r.id ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      {isLabPortal && (
                        <button 
                          onClick={() => setEditingResult(r)}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {!isLoading && results.length > 0 && (
        <Pagination {...pagination} onPageChange={pagination.jump} />
      )}

      {mapLocationData && (
        <MapModal
          isOpen={!!mapLocationData}
          onClose={() => setMapLocationData(null)}
          locationData={mapLocationData}
        />
      )}
      
      {/* Hidden container for PDF generation */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {certData && <CertificateCard result={certData} ref={certificateRef} />}
      </div>
    </div>

      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Lab Result</h3>
              <button onClick={() => setEditingResult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Animal ID</label>
                <input 
                  type="text" 
                  value={editingResult.animal_id || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PCR Result</label>
                <select 
                  value={editingResult.rvf_pcr_results || ''}
                  onChange={e => setEditingResult({...editingResult, rvf_pcr_results: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="">Select Result</option>
                  <option value="NEGATIVE">NEGATIVE</option>
                  <option value="POSITIVE">POSITIVE</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingResult(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await axios.put(`/rvf-api/lab-results/${editingResult.id}`, editingResult);
                    addToast('success', 'Result updated successfully');
                    setEditingResult(null);
                    refetch();
                  } catch (err) {
                    addToast('error', 'Failed to update result');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

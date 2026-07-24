import React, { useState, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, MapPin, Pencil, Trash2, X, Search, Download, MoreVertical, FileText } from 'lucide-react';
import MapModal from '../../components/MapModal';
import CertificateCard from '../../components/CertificateCard';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import LocationDropdown from '../../components/LocationDropdown';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { exportToExcel } from '../../utils/exportExcel';
import { generatePDFReport } from '../../utils/generatePDF';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ViewResultsTab({ isLabPortal, filters, veterinaryPhone, onFilteredDataChange }) {
  const { user, token: authContextToken } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [mapLocationData, setMapLocationData] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const certificateRef = React.useRef(null);
  const [certData, setCertData] = useState(null);
  
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [localFilters, setLocalFilters] = useState({
    district: '',
    sector: '',
    cell: '',
    village: '',
    dateFrom: '',
    timeFrom: '',
    dateTo: '',
    timeTo: '',
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
      
      const headers = authContextToken ? { Authorization: `Bearer ${authContextToken}` } : {};
      
      const res = await axios.get(url, { headers });
      return res.data;
    }
  });

  const filteredResults = useMemo(() => {
    const activeFilters = isLabPortal ? localFilters : filters;
    
    let baseResults = results;

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

  const handleExportExcel = () => {
    try {
      const data = filteredResults.map(r => ({
        'Date Uploaded': `${new Date(r.createdAt).toLocaleDateString()} ${new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`,
        'Tested Site': r.tested_site || 'N/A',
        'Farmer Name': r.farmer_name || 'N/A',
        'Farmer Phone': r.phone || 'N/A',
        'District': r.animal_district_origin || r.district || 'N/A',
        'Sector': r.sector || 'N/A',
        'Cell': r.cell || 'N/A',
        'Village': r.village || 'N/A',
        'Animal ID': r.animal_id || 'N/A',
        'Specie': r.specie || 'N/A',
        'Breed': r.breed || 'N/A',
        'Sex': r.sex || 'N/A',
        'Age': r.age || 'N/A',
        'Vacc. Status': r.vaccination_status || 'N/A',
        'Purpose': r.purpose || 'N/A',
        'Health Status': r.health_status || 'N/A',
        'PCR Result': r.rvf_pcr_results ? r.rvf_pcr_results.trim().charAt(0).toUpperCase() + r.rvf_pcr_results.trim().slice(1).toLowerCase() : 'Pending'
      }));

      const dateLabel = new Date().toISOString().split('T')[0];
      exportToExcel(data, `My_Lab_Results_${dateLabel}`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to export Excel.');
    }
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    try {
      const headers = ['Date Uploaded', 'Farmer', 'District', 'Animal ID', 'Specie', 'PCR Result'];
      const rows = filteredResults.map(r => {
        const dateStr = new Date(r.createdAt).toLocaleDateString();
        const timeStr = new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return [
          `${dateStr} ${timeStr}`,
          r.farmer_name || 'N/A',
          r.animal_district_origin || r.district || 'N/A',
          r.animal_id || 'N/A',
          r.specie || 'N/A',
          r.rvf_pcr_results ? r.rvf_pcr_results.trim().charAt(0).toUpperCase() + r.rvf_pcr_results.trim().slice(1).toLowerCase() : 'Pending'
        ];
      });

      const dateLabel = new Date().toISOString().split('T')[0];
      generatePDFReport('My Lab Results', headers, rows, `My_Lab_Results_${dateLabel}`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to generate PDF.');
    }
    setShowExportMenu(false);
  };

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
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">From</span>
              <input 
                type="date"
                value={localFilters.dateFrom}
                onChange={e => setLocalFilters({...localFilters, dateFrom: e.target.value})}
                className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
              <input 
                type="time"
                value={localFilters.timeFrom}
                onChange={e => setLocalFilters({...localFilters, timeFrom: e.target.value})}
                className="w-24 pl-2 pr-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
                title="Optional Time"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">To</span>
              <input 
                type="date"
                value={localFilters.dateTo}
                onChange={e => setLocalFilters({...localFilters, dateTo: e.target.value})}
                className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
              <input 
                type="time"
                value={localFilters.timeTo}
                onChange={e => setLocalFilters({...localFilters, timeTo: e.target.value})}
                className="w-24 pl-2 pr-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
                title="Optional Time"
              />
            </div>
            {(localFilters.search || localFilters.district || localFilters.dateFrom || localFilters.timeFrom || localFilters.dateTo || localFilters.timeTo) && (
              <button 
                onClick={() => setLocalFilters({ district: '', sector: '', cell: '', village: '', dateFrom: '', timeFrom: '', dateTo: '', timeTo: '', search: '' })}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
              >
                Clear
              </button>
            )}

            <div className="relative ml-auto flex-shrink-0" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200"
                title="Export Options"
              >
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-2">
                  <div className="px-4 py-2 text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">
                    Export to Excel
                  </div>
                  <button
                    onClick={handleExportExcel}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    Lab Results
                  </button>
                  <div className="px-4 py-2 mt-2 text-xs font-bold tracking-wider text-slate-400 uppercase border-t border-slate-100 pt-3 mb-1">
                    Export to PDF
                  </div>
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    Lab Results
                  </button>
                </div>
              )}
            </div>
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
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                    <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                    </div>
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
                      {/* HIDDEN FOR NOW AS PER USER REQUEST
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
                      */}
                      {user?.role === 'Admin' && (
                        <>
                          <button 
                            onClick={() => setEditingResult(r)}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this lab result? This action cannot be undone.')) {
                                try {
                                  await axios.delete(`/rvf-api/lab-results/${r.id}`);
                                  addToast('success', 'Lab result deleted successfully');
                                  refetch();
                                } catch (error) {
                                  addToast('error', 'Failed to delete result');
                                }
                              }
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Lab Result</h3>
              <button onClick={() => setEditingResult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">PCR Result</label>
                <select 
                  value={editingResult.rvf_pcr_results || ''}
                  onChange={e => setEditingResult({...editingResult, rvf_pcr_results: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                >
                  <option value="">Select Result</option>
                  <option value="NEGATIVE">NEGATIVE</option>
                  <option value="POSITIVE">POSITIVE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Farmer Name</label>
                <input 
                  type="text" 
                  value={editingResult.farmer_name || ''}
                  onChange={e => setEditingResult({...editingResult, farmer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Farmer Phone</label>
                <input 
                  type="text" 
                  value={editingResult.phone || ''}
                  onChange={e => setEditingResult({...editingResult, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Animal ID</label>
                <input 
                  type="text" 
                  value={editingResult.animal_id || ''}
                  onChange={e => setEditingResult({...editingResult, animal_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tested Site</label>
                <input 
                  type="text" 
                  value={editingResult.tested_site || ''}
                  onChange={e => setEditingResult({...editingResult, tested_site: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specie</label>
                <input 
                  type="text" 
                  value={editingResult.specie || ''}
                  onChange={e => setEditingResult({...editingResult, specie: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
                <input 
                  type="text" 
                  value={editingResult.breed || ''}
                  onChange={e => setEditingResult({...editingResult, breed: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
                <select 
                  value={editingResult.sex || ''}
                  onChange={e => setEditingResult({...editingResult, sex: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="text" 
                  value={editingResult.age || ''}
                  onChange={e => setEditingResult({...editingResult, age: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vaccination Status</label>
                <input 
                  type="text" 
                  value={editingResult.vaccination_status || ''}
                  onChange={e => setEditingResult({...editingResult, vaccination_status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                <input 
                  type="text" 
                  value={editingResult.purpose || ''}
                  onChange={e => setEditingResult({...editingResult, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Health Status</label>
                <input 
                  type="text" 
                  value={editingResult.health_status || ''}
                  onChange={e => setEditingResult({...editingResult, health_status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 border-t pt-2">Location Information</div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <LocationDropdown 
                  type="districts"
                  value={editingResult.animal_district_origin || ''}
                  onChange={(val) => setEditingResult({ ...editingResult, animal_district_origin: val, sector: '', cell: '', village: '' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <LocationDropdown 
                  type="sectors"
                  params={{ district: editingResult.animal_district_origin }}
                  value={editingResult.sector || ''}
                  onChange={(val) => setEditingResult({ ...editingResult, sector: val, cell: '', village: '' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cell</label>
                <LocationDropdown 
                  type="cells"
                  params={{ district: editingResult.animal_district_origin, sector: editingResult.sector }}
                  value={editingResult.cell || ''}
                  onChange={(val) => setEditingResult({ ...editingResult, cell: val, village: '' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
                <LocationDropdown 
                  type="villages"
                  params={{ district: editingResult.animal_district_origin, sector: editingResult.sector, cell: editingResult.cell }}
                  value={editingResult.village || ''}
                  onChange={(val) => setEditingResult({ ...editingResult, village: val })}
                />
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

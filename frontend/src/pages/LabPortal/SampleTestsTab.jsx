import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Download, CheckSquare, Square, Search } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { exportToExcel } from '../../utils/exportExcel';
import { ToastContext } from '../../context/ToastContext';
import Dropdown from '../../components/Dropdown';

export default function SampleTestsTab() {
  const [activeSubTab, setActiveSubTab] = useState(() => localStorage.getItem('rvf_lab_sample_subtab') || 'pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('rvf_lab_sample_subtab', activeSubTab);
  }, [activeSubTab]);
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterSector, setFilterSector] = useState('All');
  const [filterCell, setFilterCell] = useState('All');
  const [filterVillage, setFilterVillage] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { addToast } = useContext(ToastContext);

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['surveillance-forms'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/surveillance');
      return res.data;
    }
  });

  const flattenedSamples = useMemo(() => {
    const samples = [];
    forms.forEach(form => {
      if (form.samples && Array.isArray(form.samples)) {
        form.samples.forEach(sample => {
          samples.push({
            ...sample,
            form_district: form.district,
            form_province: form.province,
            form_sector: form.sector,
            form_cell: form.cell,
            form_village: form.village,
            submitted_by: form.submitted_by,
            veterinary_email: form.veterinary_email,
            collection_date: form.collection_date
          });
        });
      }
    });
    return samples;
  }, [forms]);

  const districts = useMemo(() => ['All', ...new Set(flattenedSamples.map(s => s.form_district || s.district_origin).filter(Boolean))].sort(), [flattenedSamples]);
  const sectors = useMemo(() => ['All', ...new Set(flattenedSamples.filter(s => filterDistrict === 'All' || (s.form_district || s.district_origin) === filterDistrict).map(s => s.form_sector || s.sector).filter(Boolean))].sort(), [flattenedSamples, filterDistrict]);
  const cells = useMemo(() => ['All', ...new Set(flattenedSamples.filter(s => filterSector === 'All' || (s.form_sector || s.sector) === filterSector).map(s => s.form_cell || s.cell).filter(Boolean))].sort(), [flattenedSamples, filterSector]);
  const villages = useMemo(() => ['All', ...new Set(flattenedSamples.filter(s => filterCell === 'All' || (s.form_cell || s.cell) === filterCell).map(s => s.form_village || s.village).filter(Boolean))].sort(), [flattenedSamples, filterCell]);

  const searchedSamples = useMemo(() => {
    return flattenedSamples.filter(s => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!((s.animal_id && s.animal_id.toLowerCase().includes(search)) ||
             (s.farmer_name && s.farmer_name.toLowerCase().includes(search)) ||
             ((s.district_origin || s.form_district || '') && (s.district_origin || s.form_district || '').toLowerCase().includes(search)))) {
          return false;
        }
      }

      const sDistrict = s.district_origin || s.form_district;
      const sSector = s.sector || s.form_sector;
      const sCell = s.cell || s.form_cell;
      const sVillage = s.village || s.form_village;

      if (filterDistrict !== 'All' && sDistrict !== filterDistrict) return false;
      if (filterSector !== 'All' && sSector !== filterSector) return false;
      if (filterCell !== 'All' && sCell !== filterCell) return false;
      if (filterVillage !== 'All' && sVillage !== filterVillage) return false;

      if (dateFrom) {
        if (!s.collection_date || new Date(s.collection_date) < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        if (!s.collection_date || new Date(s.collection_date) > new Date(dateTo + 'T23:59:59')) return false;
      }

      return true;
    });
  }, [flattenedSamples, searchTerm, filterDistrict, filterSector, filterCell, filterVillage, dateFrom, dateTo]);

  const pendingCount = searchedSamples.filter(s => !s.has_result).length;
  const testedCount = searchedSamples.filter(s => s.has_result).length;

  const filteredSamples = useMemo(() => {
    return searchedSamples.filter(s => activeSubTab === 'pending' ? !s.has_result : s.has_result);
  }, [searchedSamples, activeSubTab]);

  const pagination = usePagination(filteredSamples, 10);

  const handleSelectAll = () => {
    const selectableSamples = filteredSamples.filter(s => !s.has_result);
    if (selectedIds.size === selectableSamples.length && selectableSamples.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableSamples.map(s => s.id)));
    }
  };

  const toggleSelect = (id, hasResult) => {
    if (hasResult) return;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDownload = () => {
    if (selectedIds.size === 0) {
      addToast('Please select at least one sample to download', 'error');
      return;
    }

    const selectedSamples = flattenedSamples.filter(s => selectedIds.has(s.id));

    // Map to the required Excel format
    const exportData = selectedSamples.map((s, index) => ({
      'S/N': index + 1,
      'Farmer Name': s.farmer_name || '',
      'Phone': s.phone || '',
      'District Origin': s.district_origin || s.form_district || '',
      'Sector': s.sector || s.form_sector || '',
      'Cell': s.cell || s.form_cell || '',
      'Village': s.village || s.form_village || '',
      'Specie': s.specie || '',
      'Animal ID / Eartag': s.animal_id || '',
      'Breed': s.breed || '',
      'Sex': s.sex || '',
      'Age': s.age || '',
      'Vaccination Status': s.vaccination_status || '',
      'Purpose': s.purpose || '',
      'Health Status': s.health_status || '',
      'PCR Result': '' // Blank column for the technician to fill
    }));

    exportToExcel(exportData, 'RVF_Sample_Tests');
    
    // Clear selection after download
    setSelectedIds(new Set());
    addToast('Excel file downloaded successfully. Please fill in the PCR Result column and upload it.', 'success');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex space-x-6 border-b border-slate-200">
        <button
          onClick={() => { setActiveSubTab('pending'); pagination.jump(1); setSelectedIds(new Set()); }}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSubTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Pending Samples ({pendingCount})
        </button>
        <button
          onClick={() => { setActiveSubTab('tested'); pagination.jump(1); setSelectedIds(new Set()); }}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSubTab === 'tested'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Tested Samples ({testedCount})
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search by Animal ID, Farmer, District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={handleDownload}
            disabled={selectedIds.size === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedIds.size > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            Download Samples ({selectedIds.size})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">District</span>
            <Dropdown value={filterDistrict} options={districts} onChange={(val) => { setFilterDistrict(val); setFilterSector('All'); setFilterCell('All'); setFilterVillage('All'); }} />
          </div>
          {filterDistrict !== 'All' && sectors.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sector</span>
              <Dropdown value={filterSector} options={sectors} onChange={(val) => { setFilterSector(val); setFilterCell('All'); setFilterVillage('All'); }} />
            </div>
          )}
          {filterSector !== 'All' && cells.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Cell</span>
              <Dropdown value={filterCell} options={cells} onChange={(val) => { setFilterCell(val); setFilterVillage('All'); }} />
            </div>
          )}
          {filterCell !== 'All' && villages.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Village</span>
              <Dropdown value={filterVillage} options={villages} onChange={setFilterVillage} />
            </div>
          )}
          <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">From</span>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-slate-300 rounded-full px-3 py-1.5 focus:outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">To</span>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-slate-300 rounded-full px-3 py-1.5 focus:outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
            />
          </div>
        </div>
      </div>

      {filteredSamples.length === 0 && !isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center mt-4">
          <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No sample tests found" className="w-48 h-48 mb-6 object-contain opacity-75" />
          <p className="text-[17px] font-semibold text-slate-700">No sample tests found.</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">There are no samples matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
          <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-24 text-center cursor-pointer" onClick={handleSelectAll}>
                  {selectedIds.size === filteredSamples.filter(s => !s.has_result).length && filteredSamples.filter(s => !s.has_result).length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 mx-auto" />
                  )}
                </th>
                <th className="py-3 px-4 font-semibold text-slate-800">Date Collected</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Animal ID</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Farmer</th>
                <th className="py-3 px-4 font-semibold text-slate-800">District</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Specie / Sex / Age</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Health Status</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Submitted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading sample tests...
                  </td>
                </tr>
              ) : (
                pagination.currentData.map(sample => (
                  <tr 
                    key={sample.id} 
                    className={`transition-colors ${sample.has_result ? 'bg-slate-50 opacity-75' : 'hover:bg-blue-50/50 cursor-pointer'} ${selectedIds.has(sample.id) ? 'bg-blue-50/50' : ''}`}
                    onClick={() => toggleSelect(sample.id, sample.has_result)}
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {sample.has_result ? (
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded whitespace-nowrap">Got Result</span>
                      ) : (
                        <button onClick={() => toggleSelect(sample.id, sample.has_result)} className="focus:outline-none mt-1">
                          {selectedIds.has(sample.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 mx-auto" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sample.collection_date ? new Date(sample.collection_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {sample.animal_id || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900">{sample.farmer_name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{sample.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sample.district_origin || sample.form_district}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sample.specie} / {sample.sex} / {sample.age}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sample.health_status || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{sample.submitted_by || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{sample.veterinary_email}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {filteredSamples.length > 0 && (
        <div className="mt-4">
          <Pagination {...pagination} onPageChange={pagination.jump} />
        </div>
      )}
    </div>
  );
}

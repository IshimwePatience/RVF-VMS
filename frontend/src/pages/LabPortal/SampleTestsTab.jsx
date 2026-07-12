import React, { useState, useMemo, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Download, CheckSquare, Square, Search } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { exportToExcel } from '../../utils/exportExcel';
import { ToastContext } from '../../context/ToastContext';

export default function SampleTestsTab() {
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredSamples = useMemo(() => {
    return flattenedSamples.filter(s => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          (s.animal_id && s.animal_id.toLowerCase().includes(search)) ||
          (s.farmer_name && s.farmer_name.toLowerCase().includes(search)) ||
          (s.district_origin && s.district_origin.toLowerCase().includes(search))
        );
      }
      return true;
    });
  }, [flattenedSamples, searchTerm]);

  const pagination = usePagination(filteredSamples, 10);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSamples.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSamples.map(s => s.id)));
    }
  };

  const toggleSelect = (id) => {
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
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
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
          Download Selected ({selectedIds.size})
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center cursor-pointer" onClick={handleSelectAll}>
                {selectedIds.size === filteredSamples.length && filteredSamples.length > 0 ? (
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
            ) : filteredSamples.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-16 text-center text-slate-500">
                  No sample tests found.
                </td>
              </tr>
            ) : (
              pagination.currentData.map(sample => (
                <tr 
                  key={sample.id} 
                  className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${selectedIds.has(sample.id) ? 'bg-blue-50/50' : ''}`}
                  onClick={() => toggleSelect(sample.id)}
                >
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(sample.id)} className="focus:outline-none mt-1">
                      {selectedIds.has(sample.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
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
                    {sample.veterinary_email}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Pagination {...pagination} onPageChange={pagination.jump} />
      </div>
    </div>
  );
}

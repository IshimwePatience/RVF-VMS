import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import LocationDropdown from '../../components/LocationDropdown';
import ViewResultsTab from '../LabPortal/ViewResultsTab';
import { exportToExcel } from '../../utils/exportExcel';

export default function DaroLabResultsTab({ district }) {
  const [filters, setFilters] = useState({
    district: district, // Pre-lock to the DARO's district
    sector: '',
    cell: '',
    village: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  
  const [filteredData, setFilteredData] = useState([]);

  const setDateRange = (type) => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    
    if (type === 'today') {
      const localToday = new Date(Date.now() - tzOffset).toISOString().split('T')[0];
      setFilters({ ...filters, dateFrom: localToday, dateTo: localToday });
    } else if (type === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const localYesterday = new Date(yesterday.getTime() - tzOffset).toISOString().split('T')[0];
      setFilters({ ...filters, dateFrom: localYesterday, dateTo: localYesterday });
    }
  };

  const handleExport = () => {
    // Format data for excel to make it clean
    const formattedData = filteredData.map(r => ({
      'Date Uploaded': new Date(r.createdAt).toLocaleDateString(),
      'Farmer Name': r.farmer_name || 'N/A',
      'Farmer Phone': r.phone || 'N/A',
      'Animal ID': r.animal_id || 'N/A',
      'Species': r.specie || 'N/A',
      'Breed': r.breed || 'N/A',
      'Sex': r.sex || 'N/A',
      'Age': r.age || 'N/A',
      'District': r.animal_district_origin || 'N/A',
      'Sector': r.sector || 'N/A',
      'Cell': r.cell || 'N/A',
      'Village': r.village || 'N/A',
      'Tested Site': r.tested_site || 'N/A',
      'Purpose': r.purpose || 'N/A',
      'PCR Result': r.rvf_pcr_results || 'N/A'
    }));
    exportToExcel(formattedData, `DARO_Lab_Results_${district}`);
  };

  return (
    <div className="pb-12 pt-4">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Results</h1>
          <p className="text-slate-500 mt-1">View the laboratory test results for {district} district.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Excel
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-72">
            <div className="relative h-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search farmer or animal ID..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full h-full min-h-[38px] pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-36">
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm h-full min-h-[38px] flex items-center">
              <LocationDropdown 
                type="sectors"
                params={{ district: filters.district }}
                value={filters.sector}
                onChange={(val) => setFilters({ ...filters, sector: val, cell: '', village: '' })}
                placeholder="Sector"
              />
            </div>
          </div>
          <div className="w-36">
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm h-full min-h-[38px] flex items-center">
              <LocationDropdown 
                type="cells"
                params={{ district: filters.district, sector: filters.sector }}
                value={filters.cell}
                onChange={(val) => setFilters({ ...filters, cell: val, village: '' })}
                placeholder="Cell"
              />
            </div>
          </div>
          <div className="w-36">
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm h-full min-h-[38px] flex items-center">
              <LocationDropdown 
                type="villages"
                params={{ district: filters.district, sector: filters.sector, cell: filters.cell }}
                value={filters.village}
                onChange={(val) => setFilters({ ...filters, village: val })}
                placeholder="Village"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDateRange('today')}
              className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 bg-white"
            >
              Today
            </button>
            <button 
              onClick={() => setDateRange('yesterday')}
              className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 bg-white"
            >
              Yesterday
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilters({...filters, dateFrom: e.target.value})}
              className="w-36 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-600 bg-white"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date"
              value={filters.dateTo}
              onChange={e => setFilters({...filters, dateTo: e.target.value})}
              className="w-36 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-600 bg-white"
            />
          </div>

          {(filters.sector || filters.cell || filters.village || filters.dateFrom || filters.dateTo || filters.search) && (
            <button 
              onClick={() => setFilters({ district: district, sector: '', cell: '', village: '', dateFrom: '', dateTo: '', search: '' })}
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 bg-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <ViewResultsTab 
          veterinaryPhone={null} 
          filters={filters} 
          isLabPortal={false} 
          onFilteredDataChange={setFilteredData}
        />
      </div>
    </div>
  );
}

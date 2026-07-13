import React, { useState } from 'react';
import { Search } from 'lucide-react';
import LocationDropdown from '../../components/LocationDropdown';
import ViewResultsTab from '../LabPortal/ViewResultsTab';

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

  return (
    <div className="pb-12 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lab Results</h1>
        <p className="text-slate-500 mt-1">View the laboratory test results for {district} district.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
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
        <ViewResultsTab veterinaryPhone={null} filters={filters} isLabPortal={false} />
      </div>
    </div>
  );
}

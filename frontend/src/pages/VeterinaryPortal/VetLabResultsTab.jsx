import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import LocationDropdown from '../../components/LocationDropdown';
import ViewResultsTab from '../LabPortal/ViewResultsTab';

export default function VetLabResultsTab({ phone }) {
  const [filters, setFilters] = useState({
    search: '',
    district: '',
    sector: '',
    dateFrom: '',
    dateTo: ''
  });

  return (
    <div className="pb-12 pt-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Results</h1>
          <p className="text-slate-500 mt-1">View the latest laboratory test results for your submitted samples.</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
            <input 
              type="text"
              placeholder="Search farmer or animal ID..."
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              className="w-full sm:w-64 pl-3 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">District:</span>
            <div className="w-36">
              <LocationDropdown 
                type="districts"
                value={filters.district}
                onChange={(val) => setFilters({ ...filters, district: val, sector: '' })}
                placeholder="All"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Sector:</span>
            <div className="w-36">
              <LocationDropdown 
                type="sectors"
                params={{ district: filters.district }}
                value={filters.sector}
                onChange={(val) => setFilters({ ...filters, sector: val })}
                placeholder="All"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">From:</span>
            <input 
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilters({...filters, dateFrom: e.target.value})}
              className="w-36 pl-3 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">To:</span>
            <input 
              type="date"
              value={filters.dateTo}
              onChange={e => setFilters({...filters, dateTo: e.target.value})}
              className="w-36 pl-3 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {(filters.search || filters.district || filters.sector || filters.dateFrom || filters.dateTo) && (
            <button 
              onClick={() => setFilters({ search: '', district: '', sector: '', dateFrom: '', dateTo: '' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <ViewResultsTab veterinaryPhone={phone} filters={filters} isLabPortal={false} />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import LocationDropdown from '../../components/LocationDropdown';
import ViewResultsTab from '../LabPortal/ViewResultsTab';
import { exportToExcel } from '../../utils/exportExcel';
import { generatePDFReport } from '../../utils/generatePDF';
import { Download, FileText, MoreVertical } from 'lucide-react';
import SearchableDropdown from '../../components/SearchableDropdown';
import { AuthContext } from '../../context/AuthContext';

export default function VetLabResultsTab({ phone }) {
  const { user } = React.useContext(AuthContext);
  const [filters, setFilters] = useState({
    search: '',
    farmer: [],
    district: '',
    sector: '',
    dateFrom: '',
    dateTo: '',
    pcr_result: []
  });

  const [filteredData, setFilteredData] = useState([]);
  const [farmersList, setFarmersList] = useState([]);
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

  const handleExportExcel = () => {
    try {
      const data = filteredData.map(r => ({
        'Tracking ID': r.sample_tracking_id || 'N/A',
        'Date Collected': r.collectedAt ? `${new Date(r.collectedAt).toLocaleDateString()} ${new Date(r.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A',
        'Got Results On': `${new Date(r.createdAt).toLocaleDateString()} ${new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`,
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
      const metadata = {
        title: 'My Lab Results',
        vetName: user?.name || user?.full_name,
        vetPhone: phone,
        timeDownloaded: new Date().toLocaleString()
      };
      exportToExcel(data, `My_Lab_Results_${dateLabel}`, metadata);
    } catch (err) {
      console.error(err);
    }
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    try {
      // Adding all requested columns per user request, though PDF width might constrain it
      const headers = ['Tracking ID', 'Date Collected', 'Got Results On', 'Tested Site', 'Farmer', 'Phone', 'District', 'Sector', 'Cell', 'Village', 'Animal ID', 'Specie', 'Breed', 'Sex', 'Age', 'Vacc. Status', 'Purpose', 'Health Status', 'PCR Result'];
      const rows = filteredData.map(r => {
        const dateStr = new Date(r.createdAt).toLocaleDateString();
        const timeStr = new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const collectedStr = r.collectedAt ? `${new Date(r.collectedAt).toLocaleDateString()} ${new Date(r.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A';
        return [
          r.sample_tracking_id || 'N/A',
          collectedStr,
          `${dateStr} ${timeStr}`,
          r.tested_site || 'N/A',
          r.farmer_name || 'N/A',
          r.phone || 'N/A',
          r.animal_district_origin || r.district || 'N/A',
          r.sector || 'N/A',
          r.cell || 'N/A',
          r.village || 'N/A',
          r.animal_id || 'N/A',
          r.specie || 'N/A',
          r.breed || 'N/A',
          r.sex || 'N/A',
          r.age || 'N/A',
          r.vaccination_status || 'N/A',
          r.purpose || 'N/A',
          r.health_status || 'N/A',
          r.rvf_pcr_results ? r.rvf_pcr_results.trim().charAt(0).toUpperCase() + r.rvf_pcr_results.trim().slice(1).toLowerCase() : 'Pending'
        ];
      });

      const dateLabel = new Date().toISOString().split('T')[0];
      const metadata = {
        title: 'My Lab Results',
        vetName: user?.name || user?.full_name,
        vetPhone: phone,
        timeDownloaded: new Date().toLocaleString(),
        logoUrl: `${import.meta.env.BASE_URL}RAB_Logo2.png`
      };
      generatePDFReport('My Lab Results', headers, rows, `My_Lab_Results_${dateLabel}`, metadata);
    } catch (err) {
      console.error(err);
    }
    setShowExportMenu(false);
  };

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

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Farmer:</span>
            <div className="w-48">
              <SearchableDropdown
                options={farmersList}
                value={filters.farmer}
                onChange={val => setFilters({ ...filters, farmer: val })}
                placeholder="All Farmers"
                isMulti={true}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">PCR Result:</span>
            <div className="w-40">
              <SearchableDropdown
                options={['Positive', 'Negative']}
                value={filters.pcr_result}
                onChange={val => setFilters({ ...filters, pcr_result: val })}
                placeholder="All Results"
                isMulti={true}
              />
            </div>
          </div>

          {(filters.search || filters.farmer?.length > 0 || filters.district || filters.sector || filters.dateFrom || filters.dateTo || (filters.pcr_result && filters.pcr_result.length > 0)) && (
            <button 
              onClick={() => setFilters({ search: '', farmer: [], district: '', sector: '', dateFrom: '', dateTo: '', pcr_result: [] })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              Clear
            </button>
          )}

          <div className="relative ml-2" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200"
              title="Export Options"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-2">
                {/* Excel export hidden for Vet
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
                */}
                <div className="px-4 py-2 text-xs font-bold tracking-wider text-slate-400 uppercase border-t border-slate-100 pt-3 mb-1">
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

      <div className="w-full">
        <ViewResultsTab 
          veterinaryPhone={phone} 
          filters={filters} 
          isLabPortal={false} 
          onFilteredDataChange={setFilteredData} 
          onFarmersLoad={setFarmersList}
        />
      </div>
    </div>
  );
}

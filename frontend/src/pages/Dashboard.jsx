import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import LocationDropdown from '../components/LocationDropdown';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
);

// Clone colors from the screenshot
const COLORS = {
  primary: '#1e40af', // Deep blue
  deaths: '#ef4444', // Red
  recovered: '#10b981', // Green
  active: '#14b8a6', // Teal
  warning: '#f59e0b', // Yellow/Orange
  male: '#3b82f6', // Light Blue
  female: '#f43f5e', // Pink
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true, font: { size: 11 } } }
  }
};


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    province: '', district: '', sector: '', dateFrom: '', dateTo: ''
  });
  const [viewMode, setViewMode] = useState('All');

  const queryParams = new URLSearchParams();
  if (filters.province) queryParams.append('province', filters.province);
  if (filters.district) queryParams.append('district', filters.district);
  if (filters.sector) queryParams.append('sector', filters.sector);
  if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id, queryParams.toString()],
    queryFn: async () => {
      let endpoint = '';
      if (user.role === 'Admin' || user.is_central) {
        endpoint = `/rvf-api/dashboard/admin?${queryParams.toString()}`;
      } else if (user?.stock?.is_endpoint) {
        endpoint = '/rvf-api/dashboard/endpoint';
      } else if (user.role === 'Zipline' || user.role === 'Operations') {
        endpoint = '/rvf-api/dashboard/inventory';
      }
      if (!endpoint) return null;
      const res = await axios.get(endpoint);
      return res.data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard Data...</div>;
  if (!data) return <div className="p-8 text-center text-slate-500">No data available</div>;

  // Non-admin fallback
  if (user.role !== 'Admin' && !user.is_central) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Stock Dashboard</h2>
        <p className="text-slate-500">Analytics are primarily available on the Central Admin view.</p>
      </div>
    );
  }

  // --- Process Data for Charts ---
  const d = data;
  
  // 1. Daily Epidemic Curve (Bar)
  const curveData = {
    labels: d.dailyCurve?.map(c => new Date(c.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})) || [],
    datasets: [
      {
        label: 'Animals Affected',
        data: d.dailyCurve?.map(c => c.affected) || [],
        backgroundColor: COLORS.primary,
        borderRadius: 2
      },
      {
        label: 'Doses Administered',
        data: d.dailyCurve?.map(c => c.doses) || [],
        backgroundColor: COLORS.recovered,
        borderRadius: 2
      }
    ]
  };

  // 2. Clinical Outcomes (Donut)
  const outcomesData = {
    labels: d.outcomes?.map(o => o.health_status || 'Unknown') || [],
    datasets: [{
      data: d.outcomes?.map(o => o.count) || [],
      backgroundColor: [COLORS.active, COLORS.deaths, COLORS.recovered, COLORS.warning],
      borderWidth: 0,
      cutout: '65%'
    }]
  };

  // 3. Impact by District (Horizontal Bar)
  const districtData = {
    labels: d.districtImpact?.map(x => x.district || 'Unknown') || [],
    datasets: [{
      label: 'Affected Animals',
      data: d.districtImpact?.map(x => x.affected) || [],
      backgroundColor: COLORS.primary,
      borderRadius: 2,
      barThickness: 12
    }]
  };

  // 4. Species Distribution (Horizontal Bar)
  const speciesData = {
    labels: d.speciesDistribution?.map(x => x.specie || 'Unknown') || [],
    datasets: [{
      label: 'Sample Count',
      data: d.speciesDistribution?.map(x => x.count) || [],
      backgroundColor: COLORS.active,
      borderRadius: 2,
      barThickness: 12
    }]
  };

  // 5. Sex Distribution (Donut)
  const sexData = {
    labels: d.sexDistribution?.map(x => x.sex || 'Unknown') || [],
    datasets: [{
      data: d.sexDistribution?.map(x => x.count) || [],
      backgroundColor: [COLORS.male, COLORS.female, COLORS.warning],
      borderWidth: 0,
      cutout: '65%'
    }]
  };

  // 6. Vaccination Status (Bar)
  const vaxStatusData = {
    labels: d.vaccinationStatus?.map(x => x.vaccination_status || 'Unknown') || [],
    datasets: [{
      label: 'Sample Count',
      data: d.vaccinationStatus?.map(x => x.count) || [],
      backgroundColor: COLORS.warning,
      borderRadius: 2
    }]
  };

  // 7. Vaccine Stock (Bar)
  const stockLevelsData = {
    labels: d.stockByVaccine?.map(x => x.name || 'Unknown') || [],
    datasets: [{
      label: 'Doses Available',
      data: d.stockByVaccine?.map(x => x.quantity) || [],
      backgroundColor: COLORS.recovered,
      borderRadius: 2
    }]
  };

  const stockDistData = {
    labels: d.stockDist?.map(x => x.facility || 'Unknown') || [],
    datasets: [{
      label: 'Stock Quantity',
      data: d.stockDist?.map(x => x.quantity) || [],
      backgroundColor: COLORS.primary,
      borderRadius: 2
    }]
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Network Overview</h1>
          <p className="text-slate-500 mt-1">Central Stock | Veterinary Data Visualization</p>
        </div>

        {user?.role === 'Admin' && (
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">View</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700 relative">
                <select 
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-full bg-transparent border-none outline-none pl-4 pr-8 py-2 text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1em top 50%', backgroundSize: '.65em auto' }}
                >
                  <option value="All">All Charts</option>
                  <option value="Reports">Reports Only</option>
                  <option value="Stock">Stock Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Province</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700">
                <LocationDropdown 
                  type="provinces" 
                  value={filters.province} 
                  onChange={(val) => setFilters({ ...filters, province: val, district: '', sector: '' })} 
                  placeholder="All" 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">District</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700">
                <LocationDropdown 
                  type="districts" 
                  params={{ province: filters.province }} 
                  value={filters.district} 
                  onChange={(val) => setFilters({ ...filters, district: val, sector: '' })} 
                  placeholder="All" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sector</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700">
                <LocationDropdown 
                  type="sectors" 
                  params={{ district: filters.district }} 
                  value={filters.sector} 
                  onChange={(val) => setFilters({ ...filters, sector: val })} 
                  placeholder="All" 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={filters.dateFrom} 
                onChange={e => setFilters({...filters, dateFrom: e.target.value})} 
                className="w-36 px-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]" 
              />
              <span className="text-xs text-slate-400">-</span>
              <input 
                type="date" 
                value={filters.dateTo} 
                onChange={e => setFilters({...filters, dateTo: e.target.value})} 
                className="w-36 px-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]" 
              />
              {(filters.province || filters.district || filters.sector || filters.dateFrom || filters.dateTo) && (
                <button 
                  onClick={() => setFilters({province: '', district: '', sector: '', dateFrom: '', dateTo: ''})}
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div>


        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Row 1 */}
          {(viewMode === 'All' || viewMode === 'Reports') && (
            <>
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Daily Epidemic Curve — Cases vs Vaccinations</h3>
                <div className="h-[250px]"><Bar data={curveData} options={{...CHART_OPTIONS, maintainAspectRatio: false}} /></div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Clinical Outcomes</h3>
                <div className="h-[250px] pb-4"><Doughnut data={outcomesData} options={CHART_OPTIONS} /></div>
              </div>
            </>
          )}

          {/* Row 2 */}
          {(viewMode === 'All' || viewMode === 'Reports') && (
            <>
              <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Impact by District</h3>
                <div className="h-[250px]"><Bar data={districtData} options={{...CHART_OPTIONS, indexAxis: 'y'}} /></div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Species Distribution</h3>
                <div className="h-[250px]"><Bar data={speciesData} options={{...CHART_OPTIONS, indexAxis: 'y'}} /></div>
              </div>
            </>
          )}
          
          {(viewMode === 'All' || viewMode === 'Stock') && (
            <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Vaccine Stock Levels</h3>
              <div className="h-[250px]"><Bar data={stockLevelsData} options={CHART_OPTIONS} /></div>
            </div>
          )}

          {/* Row 3 */}
          {(viewMode === 'All' || viewMode === 'Stock') && (
            <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Stock Distribution by Facility</h3>
              <div className="h-[250px]"><Bar data={stockDistData} options={CHART_OPTIONS} /></div>
            </div>
          )}

          {(viewMode === 'All' || viewMode === 'Reports') && (
            <>
              <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Sex Distribution</h3>
                <div className="h-[250px] pb-4"><Doughnut data={sexData} options={CHART_OPTIONS} /></div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Vaccination Status Distribution</h3>
                <div className="h-[250px]"><Bar data={vaxStatusData} options={CHART_OPTIONS} /></div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

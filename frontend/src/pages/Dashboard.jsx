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

const MetricCard = ({ title, value, subtitle, colorClass }) => (
  <div className="bg-white border-t-4 border-slate-200 shadow-sm p-4 flex flex-col" style={{ borderTopColor: colorClass }}>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</span>
    <span className="text-3xl font-black text-slate-800" style={{ color: colorClass }}>{value}</span>
    {subtitle && <span className="text-[10px] text-slate-400 mt-1">{subtitle}</span>}
  </div>
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    province: '', district: '', sector: '', dateFrom: '', dateTo: ''
  });

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
  const stockData = {
    labels: d.stockByVaccine?.map(x => x.name || 'Unknown') || [],
    datasets: [{
      label: 'Doses Available',
      data: d.stockByVaccine?.map(x => x.quantity) || [],
      backgroundColor: COLORS.recovered,
      borderRadius: 2
    }]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header / Filters */}
      <div className="bg-[#1e3a8a] px-6 py-3 flex items-center justify-between text-white">
        <div>
          <h1 className="text-lg font-bold">Rwanda RVF Vaccine Hub Dashboard</h1>
          <p className="text-[10px] text-blue-200">Central Stock | Veterinary Data Visualization</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{d.summary?.totalAffected?.toLocaleString() || 0} Affected Animals</div>
          <div className="text-[10px] text-blue-200">Data as of {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-6 py-3 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Province</span>
          <div className="w-32 border-b-2 border-slate-200 bg-white text-xs font-bold text-slate-800">
            <LocationDropdown type="provinces" value={filters.province} onChange={(val) => setFilters({ ...filters, province: val, district: '', sector: '' })} placeholder="All Provinces" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">District</span>
          <div className="w-32 border-b-2 border-slate-200 bg-white text-xs font-bold text-slate-800">
            <LocationDropdown type="districts" params={{ province: filters.province }} value={filters.district} onChange={(val) => setFilters({ ...filters, district: val, sector: '' })} placeholder="All Districts" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sector</span>
          <div className="w-32 border-b-2 border-slate-200 bg-white text-xs font-bold text-slate-800">
            <LocationDropdown type="sectors" params={{ district: filters.district }} value={filters.sector} onChange={(val) => setFilters({ ...filters, sector: val })} placeholder="All Sectors" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded" />
          <span className="text-xs text-slate-400">-</span>
          <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded" />
          <button onClick={() => setFilters({province:'', district:'', sector:'', dateFrom:'', dateTo:''})} className="ml-2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-slate-700 transition-colors">Reset</button>
        </div>
      </div>

      <div className="p-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <MetricCard title="Animals Affected" value={d.summary?.totalAffected?.toLocaleString() || 0} colorClass={COLORS.primary} subtitle="Reported in field" />
          <MetricCard title="Animals Died" value={d.summary?.totalDied?.toLocaleString() || 0} colorClass={COLORS.deaths} subtitle="Reported mortality" />
          <MetricCard title="Doses Administered" value={d.summary?.totalDoses?.toLocaleString() || 0} colorClass={COLORS.recovered} subtitle="Total vaccines used" />
          <MetricCard title="Samples Collected" value={d.summary?.samplesCount?.toLocaleString() || 0} colorClass={COLORS.active} subtitle="Lab & Field Samples" />
          <MetricCard title="Vaccines in Stock" value={d.summary?.totalVaccinesInStock?.toLocaleString() || 0} colorClass={COLORS.warning} subtitle="Central & distributed" />
          <MetricCard title="Total Stock Value" value={(d.summary?.totalStockValue || 0).toLocaleString()} colorClass={COLORS.male} subtitle="RWF" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Row 1 */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Daily Epidemic Curve — Cases vs Vaccinations</h3>
            <div className="h-[250px]"><Bar data={curveData} options={{...CHART_OPTIONS, maintainAspectRatio: false}} /></div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Clinical Outcomes</h3>
            <div className="h-[250px] pb-4"><Doughnut data={outcomesData} options={CHART_OPTIONS} /></div>
          </div>

          {/* Row 2 */}
          <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Impact by District</h3>
            <div className="h-[250px]"><Bar data={districtData} options={{...CHART_OPTIONS, indexAxis: 'y'}} /></div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Species Distribution</h3>
            <div className="h-[250px]"><Bar data={speciesData} options={{...CHART_OPTIONS, indexAxis: 'y'}} /></div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Vaccine Stock Levels</h3>
            <div className="h-[250px]"><Bar data={stockData} options={CHART_OPTIONS} /></div>
          </div>

          {/* Row 3 */}
          <div className="bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Sex Distribution (Samples)</h3>
            <div className="h-[250px] pb-4"><Doughnut data={sexData} options={CHART_OPTIONS} /></div>
          </div>
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-4">Vaccination Status of Sampled Animals</h3>
            <div className="h-[250px]"><Bar data={vaxStatusData} options={CHART_OPTIONS} /></div>
          </div>

        </div>
      </div>
    </div>
  );
}

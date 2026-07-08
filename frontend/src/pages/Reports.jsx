import React, { useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import LocationDropdown from '../components/LocationDropdown';
import SampleTestReportView from '../components/SampleTestReportView';
import HomeVaccinationReportView from '../components/HomeVaccinationReportView';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'overview' : 'vaccination'); 
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedHomeVaccination, setSelectedHomeVaccination] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    province: '',
    district: '',
    sector: '',
    veterinary_name: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  // Query string for filters for the API
  const queryParams = new URLSearchParams();
  if (filters.province) queryParams.append('province', filters.province);
  if (filters.district) queryParams.append('district', filters.district);
  if (filters.sector) queryParams.append('sector', filters.sector);
  if (filters.veterinary_name) queryParams.append('email', filters.veterinary_name); // Assuming 'email' is used for vet search in backend

  // 1. Sector/District simple table (Allocations basically)
  const { data: reports = [], isLoading: loadingVaccination } = useQuery({
    queryKey: ['reports', user?.stock_id],
    queryFn: async () => {
      let url = '/rvf-api/administrations';
      if (user.role !== 'Admin' && user.stock_id) {
        url += `?stock_id=${user.stock_id}`;
      }
      const res = await axios.get(url);
      return res.data;
    },
    enabled: !!user && user.role !== 'Admin'
  });

  // 2. Central Overview Data
  const { data: overviewData = {}, isLoading: loadingOverview } = useQuery({
    queryKey: ['central-overview', filters.province, filters.district, filters.sector, filters.veterinary_name],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/overview?${queryParams.toString()}`);
      return res.data;
    },
    enabled: user?.role === 'Admin' && activeTab === 'overview'
  });

  // 3. Central Home Vaccinations Data
  const { data: homeVaccinations = [], isLoading: loadingHomeVaccinations } = useQuery({
    queryKey: ['central-home-vaccinations', filters.province, filters.district, filters.sector, filters.veterinary_name],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/vaccinations?${queryParams.toString()}`);
      return res.data;
    },
    enabled: user?.role === 'Admin' && activeTab === 'home_vaccination'
  });

  // 4. Central Surveillance Data
  const { data: surveillanceReports = [], isLoading: loadingSurveillance } = useQuery({
    queryKey: ['surveillance_reports'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/surveillance');
      return res.data;
    },
    enabled: user?.role === 'Admin'
  });

  // Client-side filtering for old Vaccination Reports (Sector)
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (filters.province && r.province !== filters.province) return false;
      if (filters.district && r.district !== filters.district) return false;
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.status && r.report_status !== filters.status) return false;
      if (filters.veterinary_name && !r.veterinary_name.toLowerCase().includes(filters.veterinary_name.toLowerCase())) return false;
      if (filters.dateFrom && new Date(r.date_administered) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.date_administered) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [reports, filters]);

  // Client-side filtering for Surveillance Reports
  const filteredSurveillance = useMemo(() => {
    return surveillanceReports.filter(r => {
      if (filters.province && r.province !== filters.province) return false;
      if (filters.district && r.district !== filters.district) return false;
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.veterinary_name && r.veterinary_email && !r.veterinary_email.toLowerCase().includes(filters.veterinary_name.toLowerCase())) return false;
      if (filters.dateFrom && new Date(r.collection_date || r.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.collection_date || r.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [surveillanceReports, filters]);

  // Determine which data to paginate based on active tab and role
  const getListData = () => {
    if (user?.role !== 'Admin') return filteredReports;
    if (activeTab === 'home_vaccination') return homeVaccinations; // API handles filtering
    if (activeTab === 'surveillance') return filteredSurveillance;
    return [];
  };

  const pagination = usePagination(getListData(), 10);
  
  const loading = user?.role !== 'Admin' 
    ? loadingVaccination 
    : (activeTab === 'overview' ? loadingOverview : activeTab === 'home_vaccination' ? loadingHomeVaccinations : loadingSurveillance);

  if (selectedReport) {
    return <SampleTestReportView report={selectedReport} onClose={() => setSelectedReport(null)} />;
  }

  if (selectedHomeVaccination) {
    return <HomeVaccinationReportView report={selectedHomeVaccination} onClose={() => setSelectedHomeVaccination(null)} />;
  }

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Veterinary Reports</h1>
          <p className="text-slate-500 mt-1">All forms submitted by veterinarians in the field.</p>
        </div>
      </div>

      {user?.role === 'Admin' && (
        <div className="flex space-x-4 mb-8 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('overview'); pagination.jump(1); }}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => { setActiveTab('home_vaccination'); pagination.jump(1); }}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'home_vaccination' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Home Vaccination Records
          </button>
          <button
            onClick={() => { setActiveTab('surveillance'); pagination.jump(1); }}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'surveillance' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Sample Test Forms
          </button>
        </div>
      )}

      {/* Advanced Filters (Only for Admin) */}
      {user?.role === 'Admin' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Veterinary Email</label>
              <input 
                type="text"
                placeholder="Search by email..."
                value={filters.veterinary_name}
                onChange={e => setFilters({...filters, veterinary_name: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Province</label>
              <div className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus-within:border-blue-500 focus-within:bg-white transition-colors text-sm">
                <LocationDropdown 
                  type="provinces"
                  value={filters.province}
                  onChange={(val) => setFilters({ ...filters, province: val, district: '', sector: '' })}
                  placeholder="All Provinces"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
              <div className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus-within:border-blue-500 focus-within:bg-white transition-colors text-sm">
                <LocationDropdown 
                  type="districts"
                  params={{ province: filters.province }}
                  value={filters.district}
                  onChange={(val) => setFilters({ ...filters, district: val, sector: '' })}
                  placeholder="All Districts"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Sector</label>
              <div className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus-within:border-blue-500 focus-within:bg-white transition-colors text-sm">
                <LocationDropdown 
                  type="sectors"
                  params={{ district: filters.district }}
                  value={filters.sector}
                  onChange={(val) => setFilters({ ...filters, sector: val })}
                  placeholder="All Sectors"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date From (Local filtering)</label>
              <input 
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date To</label>
              <input 
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
              />
            </div>
            <div className="lg:col-span-2 flex items-end justify-end">
              <button 
                onClick={() => setFilters({ province: '', district: '', sector: '', veterinary_name: '', dateFrom: '', dateTo: '', status: '' })}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Admin' && activeTab === 'overview' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading overview data...</p>
            </div>
          ) : Object.keys(overviewData).length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No stock data found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 pl-6 pr-3 font-semibold text-slate-800">Summary</th>
                    {Object.keys(overviewData).map(vaccine => (
                      <th key={vaccine} className="py-4 px-3 font-semibold text-slate-800 text-center">{vaccine}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3 text-slate-600 font-medium">Starting Balance</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center text-slate-600">{data.startingBalance}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3 text-slate-600 font-medium">New Received</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center text-blue-600">+{data.newReceived}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors bg-slate-50 font-bold text-slate-900">
                    <td className="py-4 pl-6 pr-3">Total</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center">{data.total}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3 text-slate-600 font-medium">Used Vaccines</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center text-emerald-600">-{data.usedVaccines}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3 text-slate-600 font-medium">Damages</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center text-red-600">-{data.damages}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors bg-slate-100 font-bold text-slate-900">
                    <td className="py-4 pl-6 pr-3">Total Balance</td>
                    {Object.values(overviewData).map((data, i) => (
                      <td key={i} className="py-4 px-3 text-center text-lg">{data.totalBalance}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading reports data...</p>
            </div>
          ) : pagination.currentData.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No reports found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {user?.role !== 'Admin' ? (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-4 pl-6 pr-3 font-semibold text-slate-800">Date</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Veterinary Name</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Location</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Vaccine</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Doses</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Affected</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Died</th>
                      <th className="py-4 pr-6 pl-3 font-semibold text-slate-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 pl-6 pr-3 text-slate-600 whitespace-nowrap">
                          {new Date(r.date_administered).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-semibold text-slate-900">{r.veterinary_name}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector}</span>
                            <span className="text-xs text-slate-500">{r.province} / {r.district}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {r.Batch?.Vaccine?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-slate-800 font-medium">
                          {r.doses_used || 0}
                        </td>
                        <td className="py-4 px-3 text-amber-600 font-medium">
                          {r.animals_affected || 0}
                        </td>
                        <td className="py-4 px-3">
                          {r.animals_died > 0 ? (
                            <span className="text-red-600 font-bold">{r.animals_died}</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-4 pr-6 pl-3">
                          {r.report_status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeTab === 'home_vaccination' ? (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-4 pl-6 pr-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Veterinary Email</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Location</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Vaccine</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Animal Type</th>
                      <th className="py-4 pr-6 pl-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedHomeVaccination(r)}>
                        <td className="py-4 pl-6 pr-3 text-slate-600 whitespace-nowrap">
                          {new Date(r.date_administered || r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-semibold text-slate-900">{r.veterinary_email}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector || r.district}</span>
                            <span className="text-xs text-slate-500">{r.province} / {r.district}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {r.vaccine_name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-slate-800 font-medium">
                          {r.animal_type || 'N/A'}
                        </td>
                        <td className="py-4 pr-6 pl-3">
                          <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                            View Form
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-4 pl-6 pr-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Veterinary Email</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Location</th>
                      <th className="py-4 px-3 font-semibold text-slate-800">Samples</th>
                      <th className="py-4 pr-6 pl-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedReport(r)}>
                        <td className="py-4 pl-6 pr-3 text-slate-600 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-semibold text-slate-900">{r.veterinary_email}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector || r.district}</span>
                            <span className="text-xs text-slate-500">{r.province} / {r.district}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                            {r.samples?.length || 0} Samples
                          </span>
                        </td>
                        <td className="py-4 pr-6 pl-3">
                          <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                            View Report
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                <Pagination {...pagination} onPageChange={pagination.jump} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

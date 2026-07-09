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
import MapModal from '../components/MapModal';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'overview' : 'vaccination'); 
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedHomeVaccination, setSelectedHomeVaccination] = useState(null);
  const [mapLocationData, setMapLocationData] = useState(null);

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

  // Removed Central Overview Data as it is no longer used

  // 3. Central Home Vaccinations Data
  const { data: homeVaccinations = [], isLoading: loadingHomeVaccinations } = useQuery({
    queryKey: ['central-home-vaccinations', filters.province, filters.district, filters.sector, filters.veterinary_name],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/vaccinations?${queryParams.toString()}`);
      return res.data;
    },
    enabled: user?.role === 'Admin'
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
    : (activeTab === 'home_vaccination' ? loadingHomeVaccinations : loadingSurveillance);

  if (selectedReport) {
    return <SampleTestReportView report={selectedReport} onClose={() => setSelectedReport(null)} />;
  }

  if (selectedHomeVaccination) {
    return <HomeVaccinationReportView report={selectedHomeVaccination} onClose={() => setSelectedHomeVaccination(null)} />;
  }

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Veterinary Reports</h1>
          <p className="text-slate-500 mt-1">All forms submitted by veterinarians in the field.</p>
        </div>

        {user?.role === 'Admin' && (
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Email</span>
              <input 
                type="text"
                placeholder="Search..."
                value={filters.veterinary_name}
                onChange={e => setFilters({...filters, veterinary_name: e.target.value})}
                className="w-40 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
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
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">From</span>
              <input 
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                className="w-36 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">To</span>
              <input 
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({...filters, dateTo: e.target.value})}
                className="w-36 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
            </div>

            {(filters.province || filters.district || filters.sector || filters.veterinary_name || filters.dateFrom || filters.dateTo || filters.status) && (
              <button 
                onClick={() => setFilters({ province: '', district: '', sector: '', veterinary_name: '', dateFrom: '', dateTo: '', status: '' })}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
              >
                Clear
              </button>
            )}
          </div>
        )}
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

      {user?.role === 'Admin' && activeTab === 'overview' ? (
        <div className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-900 border-r border-slate-200 bg-slate-100/50">Summary</th>
                  <th className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap text-center">County Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Sample Test Forms</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">
                    {filteredSurveillance?.length || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Samples Collected</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center text-blue-600 font-bold text-lg">
                    {filteredSurveillance?.reduce((acc, r) => acc + (r?.samples?.length || 0), 0) || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Home Vaccination Records</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">
                    {homeVaccinations?.length || 0}
                  </td>
                </tr>
                <tr className="bg-slate-100 hover:bg-slate-200 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-300">Total Vaccines Given</td>
                  <td className="py-4 px-6 border-r border-slate-300 text-center font-bold text-xl text-slate-900">
                    {homeVaccinations?.reduce((acc, r) => acc + (Number(r?.dose_given) || 0), 0).toLocaleString() || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading reports data...</p>
            </div>
          ) : pagination.currentData.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center mt-2">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No data" className="h-40 object-contain mb-6 opacity-75" />
              <p className="text-[15px] font-medium text-slate-500">No reports found</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <>
              {user?.role !== 'Admin' ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
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
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <Pagination {...pagination} onPageChange={pagination.jump} />
                  </div>
                </div>
              ) : activeTab === 'home_vaccination' ? (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-3 font-semibold text-slate-800">Veterinary Email</th>
                      <th className="py-3 font-semibold text-slate-800">Location</th>
                      <th className="py-3 font-semibold text-slate-800">Vaccine</th>
                      <th className="py-3 font-semibold text-slate-800">Animal Type</th>
                      <th className="py-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedHomeVaccination(r)}>
                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                          {new Date(r.date_administered || r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-slate-900">{r.veterinary_email}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector || r.district}</span>
                            <span className="text-xs text-slate-500">{r.province} / {r.district}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {r.vaccine_name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 text-slate-800 font-medium">
                          {r.animal_type || 'N/A'}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                              View Form
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapLocationData({
                                  province: r.province,
                                  district: r.district,
                                  sector: r.sector,
                                  cell: r.cell,
                                  village: r.village
                                });
                              }}
                              className="text-slate-500 font-medium hover:text-slate-700 text-sm flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              Map
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-3 font-semibold text-slate-800">Veterinary Email</th>
                      <th className="py-3 font-semibold text-slate-800">Location</th>
                      <th className="py-3 font-semibold text-slate-800">Samples</th>
                      <th className="py-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedReport(r)}>
                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-slate-900">{r.veterinary_email}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector || (r.samples && r.samples[0]?.sector) || r.district}</span>
                            <span className="text-xs text-slate-500">{r.province || 'Eastern Province'} / {r.district || (r.samples && r.samples[0]?.district_origin)}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                            {r.samples?.length || 0} Samples
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                              View Report
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapLocationData({
                                  province: r.province || 'Eastern Province',
                                  district: r.district || (r.samples && r.samples[0]?.district_origin),
                                  sector: r.sector || (r.samples && r.samples[0]?.sector),
                                  cell: r.cell || (r.samples && r.samples[0]?.cell),
                                  village: r.village || (r.samples && r.samples[0]?.village)
                                });
                              }}
                              className="text-slate-500 font-medium hover:text-slate-700 text-sm flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              Map
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-4">
                <Pagination {...pagination} onPageChange={pagination.jump} />
              </div>
            </>
          )}
        </>
      )}

      <MapModal
        isOpen={!!mapLocationData}
        onClose={() => setMapLocationData(null)}
        locationData={mapLocationData}
        title="Report Location"
      />
    </div>
  );
}

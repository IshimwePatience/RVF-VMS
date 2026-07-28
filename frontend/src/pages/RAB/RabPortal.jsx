import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as XLSX from 'xlsx';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';
import { Search, MoreVertical, Download } from 'lucide-react';
import LocationDropdown from '../../components/LocationDropdown';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function RabPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const [filters, setFilters] = useState({
    district: '',
    sector: '',
    dateFrom: '',
    timeFrom: '',
    dateTo: '',
    timeTo: '',
    search: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('rab_token');
    const userData = localStorage.getItem('rab_user');
    if (!token || !userData) {
      navigate('/rab-login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['rab-spraying-forms'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/spraying-reports?status=approved');
      return res.data;
    },
    enabled: !!user
  });

  const todayFormsCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return forms.filter(f => f.createdAt && f.createdAt.startsWith(todayStr)).length;
  }, [forms]);

  const handleSignOut = () => {
    localStorage.removeItem('rab_token');
    localStorage.removeItem('rab_user');
    navigate('/rab-login');
  };

  const filteredForms = useMemo(() => {
    return forms.filter(r => {
      if (filters.district && filters.district.length > 0) {
        if (String(r.district || '').toLowerCase() !== String(filters.district).toLowerCase()) return false;
      }
      if (filters.sector && filters.sector.length > 0) {
        if (String(r.sector || '').toLowerCase() !== String(filters.sector).toLowerCase()) return false;
      }
      
      const searchTerm = filters.search;
      if (searchTerm) {
        const searchVal = searchTerm.toLowerCase();
        let searchString = JSON.stringify(r).toLowerCase();
        if (!searchString.includes(searchVal)) return false;
      }
      if (filters.dateFrom) {
         const fromDateStr = filters.timeFrom ? `${filters.dateFrom}T${filters.timeFrom}:00` : filters.dateFrom;
         if (new Date(r.createdAt) < new Date(fromDateStr)) return false;
      }
      if (filters.dateTo) {
         const toDateStr = filters.timeTo ? `${filters.dateTo}T${filters.timeTo}:59` : `${filters.dateTo}T23:59:59`;
         if (new Date(r.createdAt) > new Date(toDateStr)) return false;
      }
      return true;
    });
  }, [forms, filters]);

  const pagination = usePagination(filteredForms, 15);

  const handleDownloadExcel = () => {
    setShowExportMenu(false);
    if (filteredForms.length === 0) return;

    const exportData = [];
    filteredForms.forEach(form => {
      (form.records || []).forEach(record => {
        exportData.push({
          'Form ID': form.id,
          'Veterinary Phone': form.veterinary_phone,
          'District': form.district,
          'Sector': form.sector,
          'Date Approved': new Date(form.updatedAt).toLocaleDateString(),
          'S/N': record.sn,
          'Itariki (Date)': record.itariki,
          'Amatungo yose yafuhererewe': record.amatungo_yose,
          "Izina ry'umuti ufuherera": record.izina_ryumuti,
          "Ingano y'umuti wose umaze kwakirwa (litiro)": record.ingano_yose_yemewe,
          "Ingano y'umuti wari uhari uyu munsi mbere yo gufuherera": record.ingano_ihari,
          "Umuti wakoreshejwe uyu munsi (litiro)": record.umuti_wakoreshejwe,
          "Umuti usigaye uyu munsi (litiro)": record.umuti_usigaye,
          "Ubwoko bw'amatungo": record.ubwoko_bwamatungo,
          'Umubare wafuherewe': record.umubare_wafuherewe
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Spraying Forms");
    XLSX.writeFile(workbook, "Approved_Spraying_Forms.xlsx");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3 shrink-0">
              <img src={minisanteLogo} alt="RAB" className="h-10 object-contain" />
              <span className="text-[22px] text-[#5f6368] font-medium tracking-tight">Rvf Vet Input hub</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-[#12aeec] text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                >
                  {user.full_names ? user.full_names.charAt(0).toUpperCase() : 'R'}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-800">RAB Portal</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{user.full_names}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">Approved Spraying Forms</h1>
            {todayFormsCount > 0 && (
              <span className="ml-4 bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm">
                {todayFormsCount} New Today
              </span>
            )}
          </div>
        </div>

        {/* Filters and Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Form ID, Vet Phone, District, Sector..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="w-40 shadow-sm">
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                  <LocationDropdown 
                    type="districts"
                    value={filters.district}
                    onChange={(val) => setFilters({ ...filters, district: val, sector: '' })}
                    placeholder="District"
                  />
                </div>
              </div>

              <div className="w-40 shadow-sm">
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
                  <LocationDropdown 
                    type="sectors"
                    params={{ district: filters.district }}
                    value={filters.sector}
                    onChange={(val) => setFilters({ ...filters, sector: val })}
                    placeholder="Sector"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">From</span>
                <input 
                  type="date"
                  value={filters.dateFrom}
                  onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec] shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">To</span>
                <input 
                  type="date"
                  value={filters.dateTo}
                  onChange={e => setFilters({...filters, dateTo: e.target.value})}
                  className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec] shadow-sm"
                />
              </div>

              {(filters.search || filters.district || filters.sector || filters.dateFrom || filters.dateTo) && (
                <button 
                  onClick={() => setFilters({ district: '', sector: '', dateFrom: '', timeFrom: '', dateTo: '', timeTo: '', search: '' })}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
                >
                  Clear
                </button>
              )}

              <div className="relative ml-auto flex-shrink-0" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 bg-white shadow-sm"
                  title="Export Options"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                    <button
                      onClick={handleDownloadExcel}
                      disabled={filteredForms.length === 0}
                      className="w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">Export to Excel</span>
                        <span className="text-xs text-slate-500">{filteredForms.length} records</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-slate-500">
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              Loading approved forms...
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No forms found" className="h-40 object-contain mb-6 opacity-75" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Approved Spraying Forms</h3>
              <p className="text-slate-500 max-w-sm">
                There are currently no approved spraying forms matching your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Approved Date</th>
                    <th className="px-6 py-4">Form ID</th>
                    <th className="px-6 py-4">District</th>
                    <th className="px-6 py-4">Sector</th>
                    <th className="px-6 py-4">Vet Phone</th>
                    <th className="px-6 py-4 text-center">Total Records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagination.currentData.map(form => (
                    <tr key={form.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-slate-600">
                        <div>{new Date(form.updatedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {new Date(form.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">#{form.id}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {form.district}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{form.sector}</td>
                      <td className="px-6 py-4 text-slate-600">{form.veterinary_phone}</td>
                      <td className="px-6 py-4 text-slate-600 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 bg-blue-50 text-blue-700 rounded-full font-bold">
                          {(form.records || []).length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-slate-100 bg-white">
                <Pagination {...pagination} onPageChange={pagination.jump} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

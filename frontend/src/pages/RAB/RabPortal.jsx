import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as XLSX from 'xlsx';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';
import { Search } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function RabPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('rab_token');
    const userData = localStorage.getItem('rab_user');
    if (!token || !userData) {
      navigate('/rab-login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['rab-spraying-forms'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/spraying-reports?status=approved');
      return res.data;
    },
    enabled: !!user
  });

  const handleSignOut = () => {
    localStorage.removeItem('rab_token');
    localStorage.removeItem('rab_user');
    navigate('/rab-login');
  };

  const availableDistricts = [...new Set(forms.map(f => f.district))].filter(Boolean).sort();

  const filteredForms = forms.filter(form => {
    let matches = true;

    if (districtFilter !== 'All' && form.district !== districtFilter) {
      matches = false;
    }

    if (dateFrom && new Date(form.updatedAt) < new Date(dateFrom)) {
      matches = false;
    }
    
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (new Date(form.updatedAt) > end) {
        matches = false;
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        String(form.id).toLowerCase().includes(term) ||
        String(form.district || '').toLowerCase().includes(term) ||
        String(form.sector || '').toLowerCase().includes(term) ||
        String(form.veterinary_phone || '').toLowerCase().includes(term);
      if (!matchesSearch) matches = false;
    }

    return matches;
  });

  const handleDownloadExcel = () => {
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

  const {
    currentData: paginatedForms,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    next,
    prev,
    jump
  } = usePagination(filteredForms, 10);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3 shrink-0">
              <img src={minisanteLogo} alt="RAB" className="h-10 object-contain" />
              <span className="text-[22px] text-[#5f6368] font-medium tracking-tight">Rvf Vet Input hub</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-[#9ca3af] text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                >
                  {user.full_names ? user.full_names.charAt(0).toUpperCase() : 'R'}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">RAB Portal</p>
                      <p className="text-xs text-slate-500">{user.full_names}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Approved Spraying Forms</h1>
          <button
            onClick={handleDownloadExcel}
            disabled={filteredForms.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
          >
            Download Excel ({filteredForms.length})
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Form ID, District, Sector, Vet Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">District</span>
              <select 
                value={districtFilter} 
                onChange={e => setDistrictFilter(e.target.value)}
                className="border-slate-200 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="All">All</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">From</span>
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)}
                className="border-slate-200 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">To</span>
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)}
                className="border-slate-200 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading approved forms...</div>
        ) : paginatedForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200">
            <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No forms found" className="h-40 object-contain mb-6 opacity-75" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Approved Spraying Forms</h3>
            <p className="text-slate-500 max-w-sm">
              There are currently no approved spraying forms matching your filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-800">Date Approved</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Veterinary</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Location</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Records</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedForms.map(form => (
                    <React.Fragment key={form.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap px-4">
                          <div className="text-sm text-slate-800 font-medium">
                            Approved: {new Date(form.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">ID: #{form.id}</span>
                          <span className="text-xs text-slate-500">{form.veterinary_phone}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-800">{form.sector || 'N/A'}</span>
                          <span className="text-xs text-slate-500">{form.district || 'Unknown'} District</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                          {(form.records || []).length} Records
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                            View Report
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        </div>
                        <table className="w-full mt-4 border-collapse text-xs">
                          <thead>
                            <tr>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">S/N</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">District</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Sector</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Cell</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Village</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Izina ry'umuti ufuherera<br/>wakoreshejwe uyu munsi</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Ingano y'umuti wose umaze<br/>kwakirwa (litiro)</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Umuti wakoreshejwe uyu<br/>munsi (litiro)</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Umuti usigaye uyu<br/>munsi (litiro)</th>
                              <th colSpan="3" className="p-2 border border-slate-200 text-center font-semibold bg-slate-100">Umubare w' amatungo yafuherewe uyu munsi</th>
                              <th rowSpan="2" className="p-2 border border-slate-200 align-middle font-semibold bg-slate-100">Amatungo yose<br/>yafuhererewe uyu munsi</th>
                            </tr>
                            <tr>
                              <th className="p-2 border border-slate-200 font-semibold bg-slate-100">Inka</th>
                              <th className="p-2 border border-slate-200 font-semibold bg-slate-100">Ihene</th>
                              <th className="p-2 border border-slate-200 font-semibold bg-slate-100">Intama</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(form.records || []).map((record, idx) => {
                                  const totalAnimals = record.amatungo_yose || ((record.inka || 0) + (record.ihene || 0) + (record.intama || 0));
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                      <td className="p-2 border border-slate-200 text-slate-700 font-medium text-center">{record.sn || (idx + 1)}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.district || form.district || 'N/A'}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.sector || form.sector || 'N/A'}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.cell || form.cell || 'N/A'}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.village || form.village || 'N/A'}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.izina_ryumuti || '-'}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.ingano_yose_yemewe || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.umuti_wakoreshejwe || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700">{record.umuti_usigaye || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700 text-center">{record.inka || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700 text-center">{record.ihene || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700 text-center">{record.intama || 0}</td>
                                      <td className="p-2 border border-slate-200 text-slate-700 text-center font-bold">{totalAnimals}</td>
                                    </tr>
                                  );
                                })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalItems > 0 && !isLoading && (
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={jump}
              onNext={next}
              onPrev={prev}
            />
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as XLSX from 'xlsx';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';
import { Search } from 'lucide-react';

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
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm border border-slate-200">
            <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No forms found" className="h-40 object-contain mb-6 opacity-75" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Approved Spraying Forms</h3>
            <p className="text-slate-500 max-w-sm">
              There are currently no approved spraying forms matching your filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Form ID</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3">Vet Phone</th>
                    <th className="px-4 py-3 text-center">Total Records</th>
                    <th className="px-4 py-3">Approved Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredForms.map(form => (
                    <tr key={form.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">#{form.id}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{form.district}</td>
                      <td className="px-4 py-3 text-slate-600">{form.sector}</td>
                      <td className="px-4 py-3 text-slate-600">{form.veterinary_phone}</td>
                      <td className="px-4 py-3 text-slate-600 text-center">{(form.records || []).length}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(form.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

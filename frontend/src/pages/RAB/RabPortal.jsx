import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function RabPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const handleDownloadExcel = () => {
    if (forms.length === 0) return;

    const exportData = [];
    forms.forEach(form => {
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
          "Ingano y'umuti wari uhari uyu munsi mbere yo": record.ingano_ihari,
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-800 tracking-tight">RAB Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">Welcome, {user.full_names}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Approved Spraying Forms</h1>
          <button
            onClick={handleDownloadExcel}
            disabled={forms.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
          >
            Download Excel
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading approved forms...</div>
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
                  {forms.map(form => (
                    <tr key={form.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">#{form.id}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{form.district}</td>
                      <td className="px-4 py-3 text-slate-600">{form.sector}</td>
                      <td className="px-4 py-3 text-slate-600">{form.veterinary_phone}</td>
                      <td className="px-4 py-3 text-slate-600 text-center">{(form.records || []).length}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(form.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {forms.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                        No approved spraying forms available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

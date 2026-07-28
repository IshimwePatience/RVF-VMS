import React, { useState, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';
import { Search } from 'lucide-react';
import LocationDropdown from '../../components/LocationDropdown';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function DaroSprayingFormsTab({ district }) {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [expandedFormId, setExpandedFormId] = useState(null);

  const [filters, setFilters] = useState({
    sector: '',
    dateFrom: '',
    timeFrom: '',
    dateTo: '',
    timeTo: '',
    search: ''
  });

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['spraying-forms', district],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/spraying-reports?district=${encodeURIComponent(district)}`);
      return res.data;
    },
    enabled: !!district
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.put(`/rvf-api/spraying-reports/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['spraying-forms']);
      addToast('Form status updated', 'success');
    },
    onError: () => addToast('Failed to update form', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/rvf-api/spraying-reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['spraying-forms']);
      addToast('Form deleted', 'success');
    },
    onError: () => addToast('Failed to delete form', 'error')
  });

  const filteredForms = useMemo(() => {
    return forms.filter(r => {
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

  const pagination = usePagination(filteredForms, 10);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search Form ID, Vet Phone, Sector..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
          <div className="w-40 shadow-sm">
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-sm">
              <LocationDropdown 
                type="sectors"
                params={{ district: district }}
                value={filters.sector}
                onChange={(val) => setFilters({ ...filters, sector: val })}
                placeholder="Sector"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 shadow-sm rounded-lg">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">From</span>
            <input 
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilters({...filters, dateFrom: e.target.value})}
              className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
            />
            <input 
              type="time"
              value={filters.timeFrom}
              onChange={e => setFilters({...filters, timeFrom: e.target.value})}
              className="w-24 pl-2 pr-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              title="Optional Time"
            />
          </div>
          <div className="flex items-center gap-1 shadow-sm rounded-lg">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">To</span>
            <input 
              type="date"
              value={filters.dateTo}
              onChange={e => setFilters({...filters, dateTo: e.target.value})}
              className="w-36 pl-3 pr-2 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
            />
            <input 
              type="time"
              value={filters.timeTo}
              onChange={e => setFilters({...filters, timeTo: e.target.value})}
              className="w-24 pl-2 pr-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              title="Optional Time"
            />
          </div>
          {(filters.search || filters.sector || filters.dateFrom || filters.timeFrom || filters.dateTo || filters.timeTo) && (
            <button 
              onClick={() => setFilters({ sector: '', dateFrom: '', timeFrom: '', dateTo: '', timeTo: '', search: '' })}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {(!isLoading && filteredForms.length === 0) ? (
        <div className="py-20 flex flex-col items-center justify-center text-center mt-2 bg-white rounded-xl border border-slate-200">
          <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No data" className="h-40 object-contain mb-6 opacity-75" />
          <p className="text-[15px] font-medium text-slate-500">No reports found</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            {forms.length === 0 ? "You don't have any spraying forms yet." : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
            {(!isLoading && forms.length > 0) && (
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-800">Date Submitted</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Form ID</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Vet Phone</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Sector</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Status</th>
                  <th className="py-4 px-6 font-semibold text-slate-800 text-right">Actions</th>
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading spraying forms...
                  </td>
                </tr>
              ) : (
                pagination.currentData.map(form => (
                  <React.Fragment key={form.id}>
                    <tr className="hover:bg-slate-50 transition-colors group">
                      <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                        <div>{new Date(form.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {new Date(form.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        #{form.id}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {form.veterinary_phone || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-800">
                          {form.sector || 'Unknown Location'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                          form.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {form.status ? form.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setExpandedFormId(expandedFormId === form.id ? null : form.id)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          >
                            {expandedFormId === form.id ? 'Hide Details' : 'View Details'}
                          </button>
                          {form.status !== 'approved' && (
                            <button 
                              onClick={() => updateMutation.mutate({ id: form.id, status: 'approved' })}
                              className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this form?')) {
                                deleteMutation.mutate(form.id);
                              }
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedFormId === form.id && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50 p-6 border-b border-slate-200">
                          <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Form Records</h4>
                          <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <tr>
                                  <th className="p-3 font-semibold">S/N</th>
                                  <th className="p-3 font-semibold">Itariki</th>
                                  <th className="p-3 font-semibold">Amatungo yose yafuhererewe</th>
                                  <th className="p-3 font-semibold">Izina ry'umuti</th>
                                  <th className="p-3 font-semibold">Ingano yose (litiro)</th>
                                  <th className="p-3 font-semibold">Ingano ihari</th>
                                  <th className="p-3 font-semibold">Umuti wakoreshejwe</th>
                                  <th className="p-3 font-semibold">Umuti usigaye</th>
                                  <th className="p-3 font-semibold">Ubwoko bw'amatungo</th>
                                  <th className="p-3 font-semibold">Umubare wafuherewe</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(form.records || []).map((record, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-3 text-slate-600 font-medium">{record.sn}</td>
                                    <td className="p-3 text-slate-600">{record.itariki}</td>
                                    <td className="p-3 text-slate-600">{record.amatungo_yose}</td>
                                    <td className="p-3 text-slate-600">{record.izina_ryumuti}</td>
                                    <td className="p-3 text-slate-600">{record.ingano_yose_yemewe}</td>
                                    <td className="p-3 text-slate-600">{record.ingano_ihari}</td>
                                    <td className="p-3 text-slate-600">{record.umuti_wakoreshejwe}</td>
                                    <td className="p-3 text-slate-600">{record.umuti_usigaye}</td>
                                    <td className="p-3 text-slate-600">{record.ubwoko_bwamatungo}</td>
                                    <td className="p-3 text-slate-600 font-medium">{record.umubare_wafuherewe}</td>
                                  </tr>
                                ))}
                                {(!form.records || form.records.length === 0) && (
                                  <tr>
                                    <td colSpan={10} className="p-4 text-center text-slate-500">No records inside this form.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
          {(!isLoading && filteredForms.length > 0) && (
            <div className="p-4 bg-white border-t border-slate-100">
              <Pagination {...pagination} onPageChange={pagination.jump} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

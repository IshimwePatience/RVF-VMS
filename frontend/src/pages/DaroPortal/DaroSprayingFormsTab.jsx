import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';
import { Search } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function DaroSprayingFormsTab({ district }) {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [expandedFormId, setExpandedFormId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading spraying forms...</div>;

  const filteredForms = forms.filter(form => {
    let matches = true;
    if (statusFilter !== 'All' && form.status !== statusFilter) matches = false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        String(form.id).toLowerCase().includes(term) ||
        String(form.veterinary_phone || '').toLowerCase().includes(term) ||
        String(form.sector || '').toLowerCase().includes(term);
      if (!matchesSearch) matches = false;
    }
    return matches;
  });

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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Form ID, Phone, Sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="py-3 font-semibold text-slate-800">Date Submitted</th>
              <th className="py-3 font-semibold text-slate-800">Veterinary</th>
              <th className="py-3 font-semibold text-slate-800">Location</th>
              <th className="py-3 font-semibold text-slate-800">Records</th>
              <th className="py-3 font-semibold text-slate-800">Status</th>
              <th className="py-3 font-semibold text-slate-800">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedForms.map(form => (
              <React.Fragment key={form.id}>
                <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setExpandedFormId(expandedFormId === form.id ? null : form.id)}>
                  <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                    <div className="text-sm text-slate-800 font-medium">
                      Submitted: {new Date(form.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">ID: #{form.id}</span>
                      <span className="text-xs text-slate-500">{form.veterinary_phone}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">{form.sector || 'N/A'}</span>
                      <span className="text-xs text-slate-500">{district} District</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                      {(form.records || []).length} Records
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${form.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {form.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedFormId(expandedFormId === form.id ? null : form.id); }}
                        className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center"
                      >
                        {expandedFormId === form.id ? 'Hide Details' : 'View Details'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                      {form.status !== 'approved' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ id: form.id, status: 'approved' }); }}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this form?')) {
                            deleteMutation.mutate(form.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedFormId === form.id && (
                  <tr>
                    <td colSpan="6" className="bg-slate-50 p-4 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-2">Form Records</h4>
                      <div className="overflow-x-auto bg-white border border-slate-200 rounded">
                        <table className="w-full text-xs text-center">
                          <thead className="bg-slate-100 text-slate-700">
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
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {paginatedForms.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-slate-500 bg-slate-50">
                  <p className="font-medium text-slate-600 mb-1">No spraying forms found</p>
                  <p className="text-sm">Try adjusting your filters or search term.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
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
      )}
    </div>
  );
}

import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';
import { Search } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import SprayingReportView from '../../components/SprayingReportView';

export default function DaroSprayingFormsTab({ district }) {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  
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

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading spraying forms...</div>;

  if (selectedReport) {
    return <SprayingReportView report={selectedReport} onClose={() => setSelectedReport(null)} />;
  }

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

      <div className="overflow-x-auto">
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
                <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedReport(form)}>
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
                        onClick={(e) => { e.stopPropagation(); setSelectedReport(form); }}
                        className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center"
                      >
                        View Details
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

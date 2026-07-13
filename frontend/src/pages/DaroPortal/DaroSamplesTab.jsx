import React, { useState, useMemo, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { ToastContext } from '../../context/ToastContext';

export default function DaroSamplesTab({ district }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('pending');
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { data: settings = {} } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/settings/system');
      return res.data;
    }
  });

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['surveillance-forms'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/surveillance');
      return res.data;
    }
  });

  const flattenedSamples = useMemo(() => {
    const samples = [];
    forms.forEach(form => {
      if (form.samples && Array.isArray(form.samples)) {
        form.samples.forEach(sample => {
          const sampleDistrict = sample.district_origin || form.district;
          if (sampleDistrict === district) {
            samples.push({
              ...sample,
              form_district: form.district,
              form_province: form.province,
              form_sector: form.sector,
              form_cell: form.cell,
              form_village: form.village,
              submitted_by: form.submitted_by,
              veterinary_email: form.veterinary_email,
              collection_date: form.collection_date
            });
          }
        });
      }
    });
    return samples;
  }, [forms, district]);

  const searchedSamples = useMemo(() => {
    return flattenedSamples.filter(s => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!((s.animal_id && s.animal_id.toLowerCase().includes(search)) ||
             (s.farmer_name && s.farmer_name.toLowerCase().includes(search)))) {
          return false;
        }
      }
      return true;
    });
  }, [flattenedSamples, searchTerm]);

  const pendingCount = searchedSamples.filter(s => !s.daro_approval_status || s.daro_approval_status === 'Pending').length;
  const reviewedCount = searchedSamples.filter(s => s.daro_approval_status && s.daro_approval_status !== 'Pending').length;

  const filteredSamples = useMemo(() => {
    return searchedSamples.filter(s => {
      if (activeSubTab === 'pending') return !s.daro_approval_status || s.daro_approval_status === 'Pending';
      return s.daro_approval_status && s.daro_approval_status !== 'Pending';
    });
  }, [searchedSamples, activeSubTab]);

  const pagination = usePagination(filteredSamples, 10);

  const approvalMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = localStorage.getItem('daro_token');
      return axios.patch(`/rvf-api/surveillance/samples/${id}/approve`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveillance-forms']);
      addToast('Sample status updated successfully', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to update sample status', 'error');
    }
  });

  const handleApproval = (id, status) => {
    if (window.confirm(`Are you sure you want to mark this sample as ${status}?`)) {
      approvalMutation.mutate({ id, status });
    }
  };

  const isApprovalEnabled = settings.daro_approval_enabled !== false && settings.daro_approval_enabled !== 'false';

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex space-x-6 border-b border-slate-200">
        <button
          onClick={() => { setActiveSubTab('pending'); pagination.jump(1); }}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSubTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => { setActiveSubTab('reviewed'); pagination.jump(1); }}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSubTab === 'reviewed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Reviewed Samples ({reviewedCount})
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search by Animal ID or Farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {filteredSamples.length === 0 && !isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center mt-4 border border-slate-200 rounded-xl bg-white">
          <p className="text-[17px] font-semibold text-slate-700">No samples found.</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">There are no samples matching your criteria in your district.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
          <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-800">Date Collected</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Animal ID</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Farmer</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Specie / Sex / Age</th>
                <th className="py-3 px-4 font-semibold text-slate-800">Submitted By</th>
                <th className="py-3 px-4 font-semibold text-slate-800 text-center">Status</th>
                {isApprovalEnabled && activeSubTab === 'pending' && (
                  <th className="py-3 px-4 font-semibold text-slate-800 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={isApprovalEnabled && activeSubTab === 'pending' ? 7 : 6} className="py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading samples...
                  </td>
                </tr>
              ) : (
                pagination.currentData.map(sample => (
                  <tr key={sample.id} className="transition-colors hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">
                      {sample.collection_date ? new Date(sample.collection_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {sample.animal_id || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900">{sample.farmer_name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{sample.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sample.specie} / {sample.sex} / {sample.age}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{sample.submitted_by || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{sample.veterinary_email}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!sample.daro_approval_status || sample.daro_approval_status === 'Pending' ? (
                        <span className="text-[11px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded">Pending</span>
                      ) : sample.daro_approval_status === 'Approved' ? (
                        <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded">Approved</span>
                      ) : (
                        <span className="text-[11px] bg-red-100 text-red-700 font-bold px-2 py-1 rounded">Rejected</span>
                      )}
                    </td>
                    {isApprovalEnabled && activeSubTab === 'pending' && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproval(sample.id, 'Approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors tooltip"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleApproval(sample.id, 'Rejected')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors tooltip"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {filteredSamples.length > 0 && (
        <div className="mt-4">
          <Pagination {...pagination} onPageChange={pagination.jump} />
        </div>
      )}
    </div>
  );
}

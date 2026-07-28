import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';

export default function DaroSprayingFormsTab({ district }) {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [expandedFormId, setExpandedFormId] = useState(null);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Form ID</th>
              <th className="px-4 py-3">Vet Phone</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Date Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {forms.map(form => (
              <React.Fragment key={form.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">#{form.id}</td>
                  <td className="px-4 py-3 text-slate-600">{form.veterinary_phone}</td>
                  <td className="px-4 py-3 text-slate-600">{form.sector}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(form.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${form.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {form.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick={() => setExpandedFormId(expandedFormId === form.id ? null : form.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {expandedFormId === form.id ? 'Hide' : 'View'}
                    </button>
                    {form.status !== 'approved' && (
                      <button 
                        onClick={() => updateMutation.mutate({ id: form.id, status: 'approved' })}
                        className="text-green-600 hover:text-green-800 font-medium"
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
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
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
                              <th className="p-2 border border-slate-200">S/N</th>
                              <th className="p-2 border border-slate-200">Itariki</th>
                              <th className="p-2 border border-slate-200">Amatungo yose yafuhererewe</th>
                              <th className="p-2 border border-slate-200">Izina ry'umuti</th>
                              <th className="p-2 border border-slate-200">Ingano yose (litiro)</th>
                              <th className="p-2 border border-slate-200">Ingano ihari</th>
                              <th className="p-2 border border-slate-200">Umuti wakoreshejwe</th>
                              <th className="p-2 border border-slate-200">Umuti usigaye</th>
                              <th className="p-2 border border-slate-200">Ubwoko bw'amatungo</th>
                              <th className="p-2 border border-slate-200">Umubare wafuherewe</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(form.records || []).map((record, idx) => (
                              <tr key={idx}>
                                <td className="p-2 border border-slate-200">{record.sn}</td>
                                <td className="p-2 border border-slate-200">{record.itariki}</td>
                                <td className="p-2 border border-slate-200">{record.amatungo_yose}</td>
                                <td className="p-2 border border-slate-200">{record.izina_ryumuti}</td>
                                <td className="p-2 border border-slate-200">{record.ingano_yose_yemewe}</td>
                                <td className="p-2 border border-slate-200">{record.ingano_ihari}</td>
                                <td className="p-2 border border-slate-200">{record.umuti_wakoreshejwe}</td>
                                <td className="p-2 border border-slate-200">{record.umuti_usigaye}</td>
                                <td className="p-2 border border-slate-200">{record.ubwoko_bwamatungo}</td>
                                <td className="p-2 border border-slate-200">{record.umubare_wafuherewe}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No spraying forms found for {district}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

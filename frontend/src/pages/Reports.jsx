import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { data: reports = [], isLoading: loading } = useQuery({
    queryKey: ['reports', user?.stock_id],
    queryFn: async () => {
      let url = '/rvf-api/administrations';
      if (user.role !== 'Admin' && user.stock_id) {
        url += `?stock_id=${user.stock_id}`;
      }
      const res = await axios.get(url);
      return res.data;
    },
    enabled: !!user
  });

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Veterinary Reports</h1>
          <p className="text-slate-500 mt-1">All forms submitted by veterinarians in the field.</p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img 
                src={`${import.meta.env.BASE_URL}empty_mascot.png`} 
                alt="Empty Records Mascot" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No reports found</h3>
            <p className="text-slate-500 text-sm mt-1">When veterinarians submit reports, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800">Date</th>
                  <th className="py-3 font-semibold text-slate-800">Veterinary Name</th>
                  <th className="py-3 font-semibold text-slate-800">Location</th>
                  <th className="py-3 font-semibold text-slate-800">Vaccine</th>
                  <th className="py-3 font-semibold text-slate-800">Doses Used</th>
                  <th className="py-3 font-semibold text-slate-800">Animals Affected</th>
                  <th className="py-3 font-semibold text-slate-800">Animals Died</th>
                  <th className="py-3 font-semibold text-slate-800">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 text-slate-600">
                      {new Date(r.date_administered).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-6">
                      <span className="font-medium text-slate-900">{r.veterinary_name}</span>
                    </td>
                    <td className="py-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="text-sm">{r.sector}</span>
                        <span className="text-xs text-slate-400">{r.province} / {r.district}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 text-sm">{r.Batch?.Vaccine?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">
                      <span className="font-medium">{r.doses_used || 0}</span>
                    </td>
                    <td className="py-4 text-slate-600">
                      {r.animals_affected || 0}
                    </td>
                    <td className="py-4 text-slate-600">
                      {r.animals_died > 0 ? (
                        <span className="text-red-600 font-medium">{r.animals_died}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                    <td className="py-4">
                      {r.report_status === 'submitted' ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Submitted</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

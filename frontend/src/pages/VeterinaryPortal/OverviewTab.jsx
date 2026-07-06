import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function OverviewTab({ email }) {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['veterinary-overview', email],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/overview?email=${encodeURIComponent(email)}`);
      return res.data;
    },
    enabled: !!email,
  });

  const vaccineKeys = data ? Object.keys(data) : [];
  const pagination = usePagination(vaccineKeys, 12);

  if (loading) {
    return <div className="py-12 flex justify-center text-slate-500">Loading overview...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to fetch overview data.</div>;
  }

  if (vaccineKeys.length === 0) {
    return (
      <div className="bg-white shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-medium text-slate-900">No vaccines found</h3>
        <p className="text-slate-500 mt-2">It looks like you haven't received any vaccines yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-slate-900 border-r border-slate-200 bg-slate-100/50">Summary</th>
              {pagination.currentData.map(key => (
                <th key={key} className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Starting Balance</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center">{data[key].startingBalance}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">New Received</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-blue-600 font-medium">+{data[key].newReceived}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 bg-slate-50/50">
              <td className="py-3 px-6 font-bold text-slate-900 border-r border-slate-200">Total</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center font-bold">{data[key].total}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Used Vaccines</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-green-600 font-medium">-{data[key].usedVaccines}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Damages</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-red-600 font-medium">-{data[key].damages}</td>
              ))}
            </tr>
            <tr className="bg-slate-100 hover:bg-slate-200 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-300">Total Balance</td>
              {pagination.currentData.map(key => (
                <td key={key} className="py-4 px-6 border-r border-slate-300 text-center font-bold text-lg text-slate-900">
                  {data[key].totalBalance}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} onPageChange={pagination.jump} />
    </div>
  );
}

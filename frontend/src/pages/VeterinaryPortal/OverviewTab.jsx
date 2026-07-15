import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { MoreVertical } from 'lucide-react';
import SampleHistoryModal from './SampleHistoryModal';

export default function OverviewTab({ phone }) {
  const [showSampleHistory, setShowSampleHistory] = useState(false);
  const [dateRange, setDateRange] = useState('all'); // 'all', 'today', 'yesterday', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['veterinary-overview', phone],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/overview?phone=${encodeURIComponent(phone)}`);
      return res.data;
    },
    enabled: !!phone,
  });

  const { data: surveillanceForms = [] } = useQuery({
    queryKey: ['vet-surveillance', phone],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/surveillance?phone=${encodeURIComponent(phone)}`);
      return res.data;
    },
    enabled: !!phone,
  });

  const filteredForms = surveillanceForms.filter(f => {
    if (dateRange === 'all') return true;
    const date = new Date(f.createdAt || f.date);
    date.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateRange === 'today') return date.getTime() === today.getTime();
    if (dateRange === 'yesterday') return date.getTime() === yesterday.getTime();
    if (dateRange === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      start.setHours(0,0,0,0);
      const end = new Date(customEnd);
      end.setHours(0,0,0,0);
      return date >= start && date <= end;
    }
    return true;
  });

  const totalRecorded = filteredForms.reduce((sum, f) => sum + (f.samples ? f.samples.length : 0), 0);
  const totalTested = filteredForms.reduce((sum, f) => sum + (f.samples ? f.samples.filter(s => s.has_result).length : 0), 0);
  const totalPositive = filteredForms.reduce((sum, f) => sum + (f.samples ? f.samples.filter(s => s.has_result && s.rvf_pcr_results?.toUpperCase().includes('POSITIVE')).length : 0), 0);
  const totalNegative = filteredForms.reduce((sum, f) => sum + (f.samples ? f.samples.filter(s => s.has_result && s.rvf_pcr_results?.toUpperCase().includes('NEGATIVE')).length : 0), 0);

  const vaccineKeys = data ? Object.keys(data) : [];
  const pagination = usePagination(vaccineKeys, 12);

  const { data: settings = {} } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/settings/system');
      return res.data;
    }
  });

  if (loading) {
    return <div className="py-12 flex justify-center text-slate-500">Loading overview...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to fetch overview data.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Vaccines Overview Table */}
      {settings.show_vaccines_overview !== false && settings.show_vaccines_overview !== 'false' && (
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden rounded-xl">
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Vaccines Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-slate-900 border-r border-slate-200 bg-slate-100/50">Summary</th>
              {vaccineKeys.length === 0 ? (
                <th className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 text-center">Total</th>
              ) : pagination.currentData.map(key => (
                <th key={key} className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap text-center">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Starting Balance</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-3 px-6 border-r border-slate-200 text-center">0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center">{data[key].startingBalance}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">New Received</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-3 px-6 border-r border-slate-200 text-center text-blue-600 font-medium">+0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-blue-600 font-medium">+{data[key].newReceived}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50 bg-slate-50/50">
              <td className="py-3 px-6 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/30">Total</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold">0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center font-bold">{data[key].total}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Used Vaccines</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-3 px-6 border-r border-slate-200 text-center text-green-600 font-medium">-0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-green-600 font-medium">-{data[key].usedVaccines}</td>
              ))}
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Damages</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-3 px-6 border-r border-slate-200 text-center text-red-600 font-medium">-0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-3 px-6 border-r border-slate-200 text-center text-red-600 font-medium">-{data[key].damages}</td>
              ))}
            </tr>
            <tr className="bg-slate-100 hover:bg-slate-200 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-300">Total Balance</td>
              {vaccineKeys.length === 0 ? (
                <td className="py-4 px-6 border-r border-slate-300 text-center font-bold text-lg text-slate-900">0</td>
              ) : pagination.currentData.map(key => (
                <td key={key} className="py-4 px-6 border-r border-slate-300 text-center font-bold text-lg text-slate-900">
                  {data[key].totalBalance}
                </td>
              ))}
            </tr>
          </tbody>
            </table>
          </div>
          {vaccineKeys.length > 0 && <Pagination {...pagination} onPageChange={pagination.jump} />}
        </div>
      )}

      {/* Samples Overview Table */}
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden rounded-xl">
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900">Samples Overview</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setDateRange(dateRange === 'all' ? 'all' : 'all');
                  if(dateRange === 'all') setDateRange('all'); // toggle trick, not really needed, just reset
                  setDateRange('all');
                }}
                className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${dateRange === 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-300 hover:bg-slate-100 text-slate-700 bg-white'}`}
              >
                All Time
              </button>
              <button 
                onClick={() => setDateRange('today')}
                className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${dateRange === 'today' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-300 hover:bg-slate-100 text-slate-700 bg-white'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setDateRange('yesterday')}
                className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${dateRange === 'yesterday' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-300 hover:bg-slate-100 text-slate-700 bg-white'}`}
              >
                Yesterday
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">From:</span>
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => {
                  setCustomStart(e.target.value);
                  setDateRange('custom');
                }}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
              <span className="text-sm text-slate-500 font-medium">To:</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => {
                  setCustomEnd(e.target.value);
                  setDateRange('custom');
                }}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-900 border-r border-slate-200 bg-slate-100/50 w-1/3">Summary</th>
                <th className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 text-center">Total</th>
                <th className="py-4 px-6 font-semibold text-slate-800 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Recorded</td>
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">{totalRecorded}</td>
                <td className="py-3 px-6 text-center align-middle" rowSpan={3}>
                  <div className="relative inline-block text-left group">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-1/2 translate-x-1/2 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button
                        onClick={() => setShowSampleHistory(true)}
                        className="w-full text-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Tested (Has Results)</td>
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-blue-600">{totalTested}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30 pl-10 text-sm border-t border-slate-100/50">└ Positive Results</td>
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-red-600 border-t border-slate-100/50">{totalPositive}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30 pl-10 text-sm border-b border-slate-200">└ Negative Results</td>
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-green-600 border-b border-slate-200">{totalNegative}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Pending</td>
                <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-amber-500">{totalRecorded - totalTested}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SampleHistoryModal 
        isOpen={showSampleHistory} 
        onClose={() => setShowSampleHistory(false)} 
        forms={surveillanceForms} 
      />
    </div>
  );
}

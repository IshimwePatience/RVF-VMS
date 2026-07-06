import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#06b6d4'];

const AnalyticDonut = ({ data }) => {
  const total = data.reduce((sum, item) => sum + parseInt(item.total_quantity || 0), 0);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[220px] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          {data.map((item, index) => {
            const radius = 42 - (index * 11);
            if (radius < 10) return null; // Max 4 rings
            const percentage = total > 0 ? (item.total_quantity / total) * 100 : 0;
            const color = COLORS[index % COLORS.length];
            const circumference = 2 * Math.PI * radius;
            
            return (
              <g key={index} transform="rotate(-90 50 50)">
                {/* Track */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke={`${color}22`}
                  strokeWidth={7}
                  strokeDasharray="4 2"
                />
                {/* Progress */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={7}
                  strokeDasharray="4 2"
                  strokeDashoffset={circumference - (percentage / 100) * circumference}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-gray-800 tracking-tighter" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
            {total.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Doses</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center text-[12px] font-bold text-gray-600">
            <span className="w-2 h-2 rounded-full mr-2 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            {entry.vaccine_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { data, isLoading: loading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      let endpoint = '';
      if (user.role === 'Admin') {
        endpoint = '/rvf-api/dashboard/admin';
      } else if (user.role === 'Zipline' || user.role === 'Operations') {
        endpoint = '/rvf-api/dashboard/inventory';
      } else if (user.stock_id) {
        endpoint = '/rvf-api/dashboard/endpoint';
      }
      
      if (!endpoint) return null;
      
      const res = await axios.get(endpoint);
      return res.data;
    },
    enabled: !!user,
  });

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">No data available</div>;

  const isEndpoint = user.stock_id !== null && user.stock_id !== undefined && user.role !== 'Admin';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-w-[120px]">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label || payload[0].name}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-[16px] font-black" style={{ color: p.fill || p.color || COLORS[0] }}>
              {p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'Admin' && (
          <>
            <div className="col-span-1 md:col-span-2 mb-4">
              <h2 className="text-base font-bold mb-2 text-gray-800">Total Stock Value</h2>
              <p className="text-5xl font-black tracking-tight text-gray-900">
                {data.totalStockValue ? `${data.totalStockValue.toLocaleString()} RWF` : '0 RWF'}
              </p>
            </div>

            <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
              <h2 className="text-base font-bold mb-4 text-gray-800">High RVF Sectors</h2>
              {(!data.highRvfSectors || data.highRvfSectors.length === 0) ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <p className="text-[13px] font-medium text-slate-500">No records found</p>
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.highRvfSectors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAffected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="total_affected" fill="url(#colorAffected)" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
              <h2 className="text-base font-bold mb-4 text-gray-800">Vaccine Usage</h2>
              {(!data.vaccineUsageSectors || data.vaccineUsageSectors.length === 0) ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <p className="text-[13px] font-medium text-slate-500">No records found</p>
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.vaccineUsageSectors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDoses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="total_doses" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorDoses)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981', style: { filter: 'drop-shadow(0px 0px 4px rgba(16,185,129,0.8))' } }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}

        {(user.role === 'Zipline' || user.role === 'Operations') && !isEndpoint && (
          <>
            <div className="col-span-1 md:col-span-2 mb-2 mt-4">
              <h2 className="text-lg font-bold text-gray-800">Current Supply Levels</h2>
            </div>
            
            {(!data.supplies || data.supplies.length === 0) ? (
              <div className="col-span-1 md:col-span-2 h-[300px] flex flex-col items-center justify-center text-center border border-slate-100 rounded-2xl bg-white shadow-sm">
                <p className="text-[14px] font-medium text-slate-500">No stock available</p>
              </div>
            ) : (
              <>
                <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-800 mb-6">Supply Overview</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.supplies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="vaccine_name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="total_quantity" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorSupply)" activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6', style: { filter: 'drop-shadow(0px 0px 4px rgba(139,92,246,0.8))' } }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white hover:shadow-md transition-shadow flex flex-col">
                  <h3 className="text-base font-bold text-gray-800 mb-1">Analytic View</h3>
                  <p className="text-[12px] text-slate-400 font-medium mb-6">Total doses proportion</p>
                  <div className="flex-1 min-h-[250px]">
                    <AnalyticDonut data={data.supplies} />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {isEndpoint && (
          <>
            <div className="col-span-1 md:col-span-2 mb-2 mt-4">
              <h2 className="text-lg font-bold text-gray-800">Your Sector Analytics</h2>
            </div>
            
            {(!data.reports || data.reports.length === 0) ? (
              <div className="col-span-1 md:col-span-2 h-[300px] flex flex-col items-center justify-center text-center border border-slate-100 rounded-2xl bg-white shadow-sm">
                <p className="text-[14px] font-medium text-slate-500">No vaccination records found</p>
              </div>
            ) : (
              <>
                <div className="col-span-1 md:col-span-2 border border-slate-100 shadow-sm rounded-2xl p-6 bg-white mb-2 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-800 mb-6">Vaccination Trend (Doses Used)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[...data.reports].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEndpointDoses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date_administered" 
                          tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} 
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip 
                          labelFormatter={(val) => new Date(val).toLocaleDateString()}
                          content={<CustomTooltip />} 
                          cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="doses_used" name="Doses Used" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorEndpointDoses)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981', style: { filter: 'drop-shadow(0px 0px 4px rgba(16,185,129,0.8))' } }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 border border-slate-100 shadow-sm rounded-2xl p-6 bg-white">
                  <h2 className="text-base font-bold text-gray-800 mb-6">Recent Vaccinations</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[14px]">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="py-3 px-2 font-bold text-slate-500 tracking-wider text-[12px]">Date</th>
                          <th className="py-3 px-2 font-bold text-slate-500 tracking-wider text-[12px]">Veterinary</th>
                          <th className="py-3 px-2 font-bold text-slate-500 tracking-wider text-[12px]">Sector</th>
                          <th className="py-3 px-2 font-bold text-slate-500 tracking-wider text-[12px]">Doses Used</th>
                          <th className="py-3 px-2 font-bold text-slate-500 tracking-wider text-[12px]">Animals Affected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.reports?.map((r) => (
                          <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-2 text-slate-600">{new Date(r.date_administered).toLocaleDateString()}</td>
                            <td className="py-4 px-2 font-semibold text-slate-800">{r.veterinary_name}</td>
                            <td className="py-4 px-2 text-slate-600">{r.sector}</td>
                            <td className="py-4 px-2 font-black text-[#8b5cf6]">{r.doses_used}</td>
                            <td className="py-4 px-2 font-black text-[#10b981]">{r.animals_affected}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

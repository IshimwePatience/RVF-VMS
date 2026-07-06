import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#10b981', '#a855f7', '#34d399', '#c084fc', '#059669'];

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
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-lg">
          <p className="text-[13px] font-bold text-slate-700 mb-1">{label || payload[0].name}</p>
          <p className="text-[14px] font-bold" style={{ color: payload[0].fill || payload[0].color || '#6366f1' }}>
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'Admin' && (
          <>
            <div className="col-span-1 md:col-span-2 mb-4">
              <h2 className="text-lg font-bold mb-2 uppercase tracking-wide text-gray-500">Total Stock Value</h2>
              <p className="text-5xl font-black tracking-tight">
                {data.totalStockValue ? `${data.totalStockValue.toLocaleString()} RWF` : '0 RWF'}
              </p>
            </div>

            <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white">
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">High RVF Sectors</h2>
              {(!data.highRvfSectors || data.highRvfSectors.length === 0) ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty" className="w-20 h-20 mix-blend-multiply mb-2 opacity-80" />
                  <p className="text-[13px] font-medium text-slate-500">No records found</p>
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.highRvfSectors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAffected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.9}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="sector" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="total_affected" fill="url(#colorAffected)" radius={[6, 6, 6, 6]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white">
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">Vaccine Usage</h2>
              {(!data.vaccineUsageSectors || data.vaccineUsageSectors.length === 0) ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty" className="w-20 h-20 mix-blend-multiply mb-2 opacity-80" />
                  <p className="text-[13px] font-medium text-slate-500">No records found</p>
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.vaccineUsageSectors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDoses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="sector" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="total_doses" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDoses)" />
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
              <h2 className="text-lg font-bold uppercase tracking-wide text-gray-500">Current Supply Levels</h2>
            </div>
            
            {(!data.supplies || data.supplies.length === 0) ? (
              <div className="col-span-1 md:col-span-2 h-[300px] flex flex-col items-center justify-center text-center border border-slate-100 rounded-2xl bg-white shadow-sm">
                <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty" className="w-24 h-24 mix-blend-multiply mb-3 opacity-80" />
                <p className="text-[14px] font-medium text-slate-500">No stock available</p>
              </div>
            ) : (
              <>
                <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-gray-500 mb-6">Supply Overview</h3>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.supplies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="vaccine_name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="total_quantity" radius={[6, 6, 6, 6]} barSize={36}>
                          {data.supplies.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-slate-100 shadow-sm rounded-2xl p-6 bg-white flex flex-col">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-gray-500 mb-1">Analytic View</h3>
                  <p className="text-[13px] text-slate-500 mb-6">Total doses proportion</p>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.supplies}
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={105}
                          paddingAngle={6}
                          dataKey="total_quantity"
                          nameKey="vaccine_name"
                          stroke="none"
                          cornerRadius={8}
                        >
                          {data.supplies.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
                    {data.supplies.map((entry, index) => (
                      <div key={index} className="flex items-center text-[13px] font-medium text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {entry.vaccine_name}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {isEndpoint && (
          <>
            <div className="col-span-1 md:col-span-2 mb-2 mt-4">
              <h2 className="text-lg font-bold uppercase tracking-wide text-gray-500">Your Sector Analytics</h2>
            </div>
            
            {(!data.reports || data.reports.length === 0) ? (
              <div className="col-span-1 md:col-span-2 h-[300px] flex flex-col items-center justify-center text-center border border-slate-100 rounded-2xl bg-white shadow-sm">
                <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty" className="w-24 h-24 mix-blend-multiply mb-3 opacity-80" />
                <p className="text-[14px] font-medium text-slate-500">No vaccination records found</p>
              </div>
            ) : (
              <>
                <div className="col-span-1 md:col-span-2 border border-slate-100 shadow-sm rounded-2xl p-6 bg-white mb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-gray-500 mb-6">Vaccination Trend (Doses Used)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[...data.reports].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEndpointDoses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date_administered" 
                          tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} 
                        />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          labelFormatter={(val) => new Date(val).toLocaleDateString()}
                          content={<CustomTooltip />} 
                        />
                        <Area type="monotone" dataKey="doses_used" name="Doses Used" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEndpointDoses)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 border border-slate-100 shadow-sm rounded-2xl p-6 bg-white">
                  <h2 className="text-lg font-bold uppercase tracking-wide text-gray-500 mb-6">Recent Vaccinations</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[14px]">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-[12px]">Date</th>
                          <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-[12px]">Veterinary</th>
                          <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-[12px]">Sector</th>
                          <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-[12px]">Doses Used</th>
                          <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-[12px]">Animals Affected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.reports?.map((r) => (
                          <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-2 text-slate-600">{new Date(r.date_administered).toLocaleDateString()}</td>
                            <td className="py-4 px-2 font-medium text-slate-800">{r.veterinary_name}</td>
                            <td className="py-4 px-2 text-slate-600">{r.sector}</td>
                            <td className="py-4 px-2 font-bold text-[#8b5cf6]">{r.doses_used}</td>
                            <td className="py-4 px-2 font-bold text-[#10b981]">{r.animals_affected}</td>
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

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '';
        if (user.role === 'Admin') {
          endpoint = '/api/dashboard/admin';
        } else if (user.role === 'Zipline' || user.role === 'Operations') {
          endpoint = '/api/dashboard/inventory';
        } else if (user.stock_id) {
          endpoint = '/api/dashboard/endpoint';
        }

        if (endpoint) {
          const res = await axios.get(endpoint);
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">No data available</div>;

  const isEndpoint = user.stock_id !== null && user.stock_id !== undefined && user.role !== 'Admin';

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {user.role === 'Admin' && (
          <>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold mb-2 uppercase tracking-wide text-gray-500">Total Stock Value</h2>
              <p className="text-5xl font-black tracking-tight">{data.totalStockValue ? `${data.totalStockValue.toLocaleString()} RWF` : '0 RWF'}</p>
            </div>
            
            <div className="hidden md:block"></div> {/* Spacer for the grid layout */}

            <div>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">High RVF Sectors</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.highRvfSectors || []}>
                    <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="total_affected" fill="#111" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">Vaccine Usage</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vaccineUsageSectors || []}>
                    <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="total_doses" fill="#111" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {(user.role === 'Zipline' || user.role === 'Operations') && !isEndpoint && (
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">Current Supply Levels</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-3 font-bold uppercase tracking-wider">Vaccine</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Total Doses Available</th>
                </tr>
              </thead>
              <tbody>
                {data.supplies?.map((s, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3 font-medium">{s.Vaccine?.name || 'Unknown'}</td>
                    <td className="py-3">{s.total_quantity}</td>
                  </tr>
                ))}
                {(!data.supplies || data.supplies.length === 0) && (
                  <tr>
                    <td colSpan="2" className="py-6 text-gray-500">No stock available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isEndpoint && (
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-500">Recent Vaccinations (Your Sector)</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-3 font-bold uppercase tracking-wider">Date</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Veterinary</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Sector</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Doses Used</th>
                  <th className="py-3 font-bold uppercase tracking-wider">Animals Affected</th>
                </tr>
              </thead>
              <tbody>
                {data.reports?.map((r) => (
                  <tr key={r.id} className="border-b border-gray-200">
                    <td className="py-3">{new Date(r.date_administered).toLocaleDateString()}</td>
                    <td className="py-3">{r.veterinary_name}</td>
                    <td className="py-3">{r.sector}</td>
                    <td className="py-3 font-bold">{r.doses_used}</td>
                    <td className="py-3">{r.animals_affected}</td>
                  </tr>
                ))}
                {(!data.reports || data.reports.length === 0) && (
                  <tr>
                    <td colSpan="5" className="py-6 text-gray-500">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

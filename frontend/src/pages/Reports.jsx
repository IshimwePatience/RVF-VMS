import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let url = '/api/administrations';
        if (user.role !== 'Admin' && user.stock_id) {
          url += `?stock_id=${user.stock_id}`;
        }
        
        const res = await axios.get(url);
        setReports(res.data);
      } catch (err) {
        console.error(err);
        addToast('Failed to load reports', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchReports();
    }
  }, [user]);

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-800">Veterinary Reports</h1>
        <p className="text-gray-500 mt-1">All forms submitted by veterinarians in the field.</p>
      </div>

      {loading ? (
        <div className="py-8">Loading reports...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-3 font-bold uppercase tracking-wider">Date</th>
                <th className="py-3 font-bold uppercase tracking-wider">Veterinary Name</th>
                <th className="py-3 font-bold uppercase tracking-wider">Location (Prov/Dist/Sect)</th>
                <th className="py-3 font-bold uppercase tracking-wider">Vaccine</th>
                <th className="py-3 font-bold uppercase tracking-wider text-right">Doses Used</th>
                <th className="py-3 font-bold uppercase tracking-wider text-right">Animals Affected</th>
                <th className="py-3 font-bold uppercase tracking-wider text-right">Animals Died</th>
                <th className="py-3 font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-gray-200">
                  <td className="py-3">{new Date(r.date_administered).toLocaleDateString()}</td>
                  <td className="py-3">{r.veterinary_name}</td>
                  <td className="py-3">{r.province} / {r.district} / {r.sector}</td>
                  <td className="py-3">{r.Batch?.Vaccine?.name || 'N/A'}</td>
                  <td className="py-3 text-right font-medium">{r.doses_used || 0}</td>
                  <td className="py-3 text-right">{r.animals_affected || 0}</td>
                  <td className="py-3 text-right text-red-600">{r.animals_died || 0}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-bold uppercase ${r.report_status === 'submitted' ? 'text-green-700' : 'text-orange-600'}`}>
                      {r.report_status}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

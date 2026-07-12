import React, { useState, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, MapPin, Pencil, Trash2, X } from 'lucide-react';
import MapModal from '../../components/MapModal';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';

export default function ViewResultsTab({ isLabPortal, filters }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [mapLocationData, setMapLocationData] = useState(null);
  const [editingResult, setEditingResult] = useState(null);

  const { data: results = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['lab-results'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/lab-results');
      return res.data;
    }
  });

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      if (filters?.district && r.animal_district_origin !== filters.district && r.district !== filters.district) return false;
      if (filters?.sector && r.sector !== filters.sector) return false;
      if (filters?.veterinary_name) {
        const searchVal = filters.veterinary_name.toLowerCase();
        const rPhone = (r.phone || '').toLowerCase();
        const rFarmer = (r.farmer_name || '').toLowerCase();
        if (!rPhone.includes(searchVal) && !rFarmer.includes(searchVal)) return false;
      }
      if (filters?.dateFrom && new Date(r.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters?.dateTo && new Date(r.createdAt) > new Date(filters.dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [results, filters]);

  const pagination = usePagination(filteredResults || [], 10);

  return (
    <>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
          {(!isLoading && results.length > 0) && (
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-800">Date Uploaded</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Farmer</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Location</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Animal ID</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Specie</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Breed</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Sex</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Age</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Vacc. Status</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Purpose</th>
                <th className="py-4 px-6 font-semibold text-slate-800">Health Status</th>
                <th className="py-4 px-6 font-semibold text-slate-800">PCR Result</th>
                {isLabPortal && (
                  <th className="py-4 px-6 font-semibold text-slate-800 text-right">Actions</th>
                )}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={user?.role === 'Lab User' ? 13 : 12} className="py-12 text-center text-slate-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading results...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'Lab User' ? 13 : 12} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No data" className="h-40 object-contain mb-6 opacity-75" />
                    <p className="text-[15px] font-medium text-slate-500">No reports found</p>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                </td>
              </tr>
              ) : (
              pagination.currentData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100 transition-colors group">
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{r.farmer_name || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{r.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">
                          {r.village || r.cell || r.sector || r.animal_district_origin || 'Unknown Location'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {[r.animal_district_origin, r.sector, r.cell].filter(Boolean).filter(x => x !== (r.village || r.cell || r.sector || r.animal_district_origin)).join(' / ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {r.animal_id || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.specie || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.breed || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.sex || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.age || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.vaccination_status || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.purpose || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.health_status || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                      r.rvf_pcr_results?.toUpperCase().includes('POSITIVE') 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {r.rvf_pcr_results || 'UNKNOWN'}
                    </span>
                  </td>
                  {isLabPortal && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingResult(r)}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
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

      {!isLoading && results.length > 0 && (
        <Pagination {...pagination} />
      )}

      {mapLocationData && (
        <MapModal
          isOpen={!!mapLocationData}
          onClose={() => setMapLocationData(null)}
          locationData={mapLocationData}
        />
      )}

      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Lab Result</h3>
              <button onClick={() => setEditingResult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Animal ID</label>
                <input 
                  type="text" 
                  value={editingResult.animal_id || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PCR Result</label>
                <select 
                  value={editingResult.rvf_pcr_results || ''}
                  onChange={e => setEditingResult({...editingResult, rvf_pcr_results: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="">Select Result</option>
                  <option value="NEGATIVE">NEGATIVE</option>
                  <option value="POSITIVE">POSITIVE</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingResult(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await axios.put(`/rvf-api/lab-results/${editingResult.id}`, editingResult);
                    addToast('success', 'Result updated successfully');
                    setEditingResult(null);
                    refetch();
                  } catch (err) {
                    addToast('error', 'Failed to update result');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

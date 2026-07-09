import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCw, MapPin } from 'lucide-react';
import MapModal from '../../components/MapModal';

export default function ViewResultsTab() {
  const [mapLocationData, setMapLocationData] = useState(null);

  const { data: results = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['lab-results'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/lab-results');
      return res.data;
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Uploaded Results</h2>
          <p className="text-sm text-slate-500 mt-1">View all RVF test results you have uploaded</p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-slate-800">Date Uploaded</th>
              <th className="py-4 px-6 font-semibold text-slate-800">Farmer</th>
              <th className="py-4 px-6 font-semibold text-slate-800">Location</th>
              <th className="py-4 px-6 font-semibold text-slate-800">Animal ID</th>
              <th className="py-4 px-6 font-semibold text-slate-800">Specie</th>
              <th className="py-4 px-6 font-semibold text-slate-800">PCR Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading results...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  No results uploaded yet.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
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
                        <span className="text-sm font-medium text-slate-800">{r.sector || r.animal_district_origin}</span>
                        <span className="text-xs text-slate-500">{r.animal_district_origin}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setMapLocationData({
                            province: 'Eastern Province', // typically Eastern for Rwamagana/Ngoma
                            district: r.animal_district_origin,
                            sector: r.sector,
                            cell: r.cell,
                            village: r.village
                          });
                        }}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        title="View Map"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {r.animal_id || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {r.specie || 'N/A'}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <MapModal 
        isOpen={!!mapLocationData} 
        onClose={() => setMapLocationData(null)}
        locationData={mapLocationData}
        title="Result Location"
      />
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Search } from 'lucide-react';

export default function SampleHistoryModal({ isOpen, onClose, forms }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSamples = useMemo(() => {
    let allSamples = [];
    forms.forEach(form => {
      if (form.samples) {
        form.samples.forEach(sample => {
          allSamples.push({
            ...sample,
            createdAt: form.createdAt,
            farmer_name: sample.farmer_name || form.farmer_name,
            phone: sample.phone || form.farmer_phone
          });
        });
      }
    });

    return allSamples.filter(s => {
      const sDate = new Date(s.createdAt);
      if (dateFrom && sDate < new Date(dateFrom)) return false;
      if (dateTo && sDate > new Date(dateTo + 'T23:59:59')) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = (s.farmer_name || '').toLowerCase().includes(q);
        const matchesPhone = (s.phone || '').toLowerCase().includes(q);
        const matchesAnimal = (s.animal_id || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesAnimal) return false;
      }

      if (activeTab === 'pending' && s.has_result) return false;
      if (activeTab === 'tested' && !s.has_result) return false;

      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [forms, dateFrom, dateTo, activeTab, searchQuery]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Samples History</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-end px-6 border-b border-slate-100">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              All Samples
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('tested')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tested' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              Tested
            </button>
          </div>
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search farmer or animal..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">From:</span>
            <input 
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">To:</span>
            <input 
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button 
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-sm text-red-600 font-medium hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {filteredSamples.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No samples found for the selected dates.</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold text-slate-900">Date</th>
                  <th className="py-3 px-4 font-semibold text-slate-900">Farmer</th>
                  <th className="py-3 px-4 font-semibold text-slate-900">Animal ID</th>
                  <th className="py-3 px-4 font-semibold text-slate-900">Specie</th>
                  <th className="py-3 px-4 font-semibold text-slate-900 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSamples.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{s.farmer_name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{s.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{s.animal_id || 'N/A'}</td>
                    <td className="py-3 px-4">{s.specie || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      {s.has_result ? (
                        <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Tested</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

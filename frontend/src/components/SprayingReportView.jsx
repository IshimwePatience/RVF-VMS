import React, { useState } from 'react';
import { Search } from 'lucide-react';
import minisanteLogo from '../assets/images/MINISANTE.png';

export default function SprayingReportView({ report, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!report) return null;

  const records = report.records || [];
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(record).some(val => 
      val && val.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto font-sans pt-8 pb-16">
      <div className="max-w-4xl mx-auto w-full px-4">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onClose}
            className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Reports
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-500">
              Submitted on {new Date(report.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-t-[10px] border-t-purple-600 overflow-hidden mb-4">
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-[32px] font-normal text-slate-900 mb-2 leading-tight">
                  Spraying Activities Form
                </h1>
                <p className="text-sm text-slate-600 mb-1">
                  Republic of Rwanda<br/>
                  MINISTRY OF AGRICULTURE AND ANIMAL RESOURCES (MINAGRI)<br/>
                  Rwanda Agriculture and Animal Resources Development Board (RAB)
                </p>
                <div className="text-sm font-semibold text-slate-800 mt-4">
                  Veterinary: <span className="text-slate-600 font-normal">{report.veterinary_name || 'Unknown'} ({report.veterinary_phone || 'N/A'})</span>
                </div>
              </div>
              <img src={minisanteLogo} alt="MINISANTE" className="h-24 object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Status</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px] uppercase font-semibold">
                    {report.status || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Date Approved</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.status === 'approved' ? new Date(report.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-4 px-2 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Records ({filteredRecords.length || 0})</h2>
            <div className="relative max-w-md w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search record details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
          
          {([...filteredRecords].sort((a, b) => (parseInt(a.sn) || 0) - (parseInt(b.sn) || 0))).map((record, idx) => {
            const totalAnimals = record.amatungo_yose || ((record.inka || 0) + (record.ihene || 0) + (record.intama || 0));
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center">
                  <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 shadow-sm">
                    {record.sn || idx + 1}
                  </span>
                  <h3 className="font-semibold text-slate-800 text-lg">Record Details</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Izina ry'umuti (Medicine Name)</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.izina_ryumuti || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Ingano yakiriwe (Amount received)</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.ingano_yose_yemewe || 0} L</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Umuti wakoreshejwe (Used)</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.umuti_wakoreshejwe || 0} L</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Umuti usigaye (Remaining)</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.umuti_usigaye || 0} L</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">District</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.district || report.district || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Sector</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.sector || report.sector || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Cell</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.cell || report.cell || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Village</label>
                      <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{record.village || report.village || '-'}</div>
                    </div>

                    <div className="md:col-span-3 bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3 uppercase tracking-wider">Animals Sprayed (Amatungo yafuherewe)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1 font-medium">Inka (Cows)</label>
                          <div className="font-bold text-lg text-blue-900">{record.inka || 0}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1 font-medium">Ihene (Goats)</label>
                          <div className="font-bold text-lg text-blue-900">{record.ihene || 0}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1 font-medium">Intama (Sheep)</label>
                          <div className="font-bold text-lg text-blue-900">{record.intama || 0}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1 font-medium">Total (Yose)</label>
                          <div className="font-bold text-lg text-blue-900">{totalAnimals}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {(!report.records || report.records.length === 0) ? (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 shadow-sm text-slate-500 italic">
              No records were included in this submission.
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 shadow-sm text-slate-500 italic">
              No records match your search.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

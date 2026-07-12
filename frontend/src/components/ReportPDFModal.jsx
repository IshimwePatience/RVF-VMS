import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

export default function ReportPDFModal({ isOpen, onClose, onGenerate, title }) {
  const [dateRange, setDateRange] = useState('today');
  const [reportStatus, setReportStatus] = useState('reported');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    let start, end;
    const now = new Date();
    
    if (dateRange === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    } else if (dateRange === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    } else {
      start = customStart ? new Date(customStart) : new Date(0);
      end = customEnd ? new Date(customEnd) : new Date();
      end.setHours(23, 59, 59, 999);
    }

    onGenerate({
      startDate: start,
      endDate: end,
      dateRangeLabel: dateRange,
      status: reportStatus
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Generate PDF: {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Report Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="reportStatus" 
                  value="reported" 
                  checked={reportStatus === 'reported'} 
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">Submitted Reports</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="reportStatus" 
                  value="missing" 
                  checked={reportStatus === 'missing'} 
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm text-slate-700">Did NOT Submit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input 
                  type="date" 
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

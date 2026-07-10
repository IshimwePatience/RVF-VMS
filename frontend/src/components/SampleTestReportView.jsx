import React, { useState } from 'react';
import minisanteLogo from '../assets/images/MINISANTE.png';
import MapModal from './MapModal';

export default function SampleTestReportView({ report, onClose }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto font-sans pt-8 pb-16">
      <div className="max-w-3xl mx-auto w-full px-4">
        
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
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              View Map
            </button>
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
                  Sample submission form for the suspect of Rift Valley Fever
                </h1>
                <p className="text-sm text-slate-600 mb-1">
                  Republic of Rwanda<br/>
                  MINISTRY OF AGRICULTURE AND ANIMAL RESOURCES (MINAGRI)<br/>
                  Rwanda Agriculture and Animal Resources Development Board (RAB)
                </p>
                <div className="text-sm font-semibold text-slate-800 mt-4">
                  Veterinary Email: <span className="text-slate-600 font-normal">{report.veterinary_email}</span>
                </div>
              </div>
              <img src={minisanteLogo} alt="MINISANTE" className="h-24 object-contain" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">District</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.district || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">From Abattoir</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.from_abattoir || 'N/A'}
                  </div>
                </div>
                {report.from_abattoir === 'Yes' && (
                  <div>
                    <label className="block text-base text-slate-800 mb-2 font-medium">Name of abattoir / Slap mark</label>
                    <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                      {report.abattoir_details || 'N/A'}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Type of Samples</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.samples_type || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Date of collection</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.collection_date ? new Date(report.collection_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Test requested</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.test_requested || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Submitted by</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.submitted_by || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-base text-slate-800 mb-2 font-medium">Phone number</label>
                  <div className="px-3 py-2 bg-slate-50 rounded text-slate-800 border-b border-slate-300 min-h-[40px]">
                    {report.phone_number || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Rows */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 px-2">Samples Submitted ({report.samples?.length || 0})</h2>
          
          {(report.samples || []).map((sample, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center">
                <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 shadow-sm">
                  {sample.sn || idx + 1}
                </span>
                <h3 className="font-semibold text-slate-800 text-lg">Sample Details</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Name of farmer</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.farmer_name || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Phone / Mobile</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.phone || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Origin (District)</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.district_origin || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Sector</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.sector || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Cell</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.cell || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Village</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.village || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Specie</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.specie || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Animal ID/Tag NO</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.animal_id || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Breed</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.breed || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Sex</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.sex || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Age</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.age || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Vaccination status</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.vaccination_status || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Purpose of keeping</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.purpose || '-'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-500 mb-1">Health status (Healthy/sick/dead/abortion)</label>
                    <div className="font-medium text-slate-900 border-b border-slate-200 pb-1">{sample.health_status || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!report.samples || report.samples.length === 0) && (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 shadow-sm text-slate-500 italic">
              No samples were included in this submission.
            </div>
          )}
        </div>

        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          locationData={{
            province: report.province,
            district: report.district,
            sector: report.sector,
            cell: report.cell,
            village: report.village
          }}
          title="Sample Collection Location"
        />
      </div>
    </div>
  );
}

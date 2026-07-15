import React, { useState } from 'react';
import minisanteLogo from '../assets/images/MINISANTE.png';
import MapModal from './MapModal';

export default function HomeVaccinationReportView({ report, onClose }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onClose}
            className="flex items-center text-white hover:text-blue-200 transition-colors bg-slate-800/50 px-4 py-2 rounded-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </button>

        </div>

        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative">
            <div className="h-3 w-full bg-[#1da1f2]"></div>
            <div className="p-8">
              <img src={minisanteLogo} alt="MINISANTE" className="h-16 object-contain mb-6" />
              <h1 className="text-3xl font-normal text-slate-800 mb-3 tracking-tight">Record Home Vaccinations</h1>
              <p className="text-sm text-slate-600 border-b border-slate-200 pb-6 mb-4">
                Submitted by {report.veterinary_email} on {new Date(report.date_administered || report.createdAt).toLocaleDateString()}
              </p>
              
              <div className="grid grid-cols-2 gap-y-4 text-sm mt-4">
                <div>
                  <p className="text-slate-500 font-medium">Province</p>
                  <p className="font-semibold text-slate-800">{report.province || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">District</p>
                  <p className="font-semibold text-slate-800">{report.district || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Sector</p>
                  <p className="font-semibold text-slate-800">{report.sector || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Cell / Village</p>
                  <p className="font-semibold text-slate-800">{report.cell || 'N/A'} / {report.village || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Home Information Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative">
            <div className="h-2 w-full bg-[#1da1f2]"></div>
            <div className="p-8">
              <h2 className="text-xl font-normal text-slate-800 mb-6">Home Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Owner's Full Name</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.owner_name}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Owner's Phone Number</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.owner_phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Owner's National ID (Optional)</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.owner_national_id || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Home Identifier (e.g. Plot number or Landmark)</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.home_identifier}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Animal Detail Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-normal text-slate-800 mb-6 border-b border-slate-100 pb-4">Animal Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Animal Type</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.animal_type}</div>
                </div>
                {report.animal_identification && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Animal Identification (Tag/Name)</label>
                    <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.animal_identification}</div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Vaccine Used</label>
                  <div className="w-full pb-2 border-b border-slate-300 text-slate-800">
                    <span className="inline-flex px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                      {report.vaccine_name} [Batch {report.batch_number}]
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Doses Successfully Given</label>
                    <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.dose_given}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Damages / Wasted Doses</label>
                    <div className="w-full pb-2 border-b border-slate-300 text-slate-800">{report.damages}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          This is a read-only view of a submitted Home Vaccination Record.
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
          title="Vaccination Location"
        />
      </div>
    </div>
  );
}

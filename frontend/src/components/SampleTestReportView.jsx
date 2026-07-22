import React, { useState, useContext } from 'react';
import { MapPin, ArrowLeft, Download, FileText, CheckCircle2, Clock, Check, X, Pencil, Trash2 } from 'lucide-react';
import minisanteLogo from '../assets/images/MINISANTE.png';
import MapModal from './MapModal';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ToastContext } from '../context/ToastContext';

export default function SampleTestReportView({ report, onClose }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [editingSample, setEditingSample] = useState(null);
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
          
          {([...(report.samples || [])].sort((a, b) => (parseInt(a.sn) || 0) - (parseInt(b.sn) || 0))).map((sample, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center">
                <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 shadow-sm">
                  {sample.sn || idx + 1}
                </span>
                <h3 className="font-semibold text-slate-800 text-lg">Sample Details</h3>
                {user?.role === 'Admin' && (
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => setEditingSample(sample)}
                      className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      title="Edit Sample"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this sample?')) {
                          try {
                            await axios.delete(`/rvf-api/surveillance/samples/${sample.id}`);
                            addToast('success', 'Sample deleted successfully');
                            if (onClose) onClose(); // close or refresh
                          } catch (error) {
                            addToast('error', 'Failed to delete sample');
                          }
                        }
                      }}
                      className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete Sample"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
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
            district: report.district || (report.samples?.[0]?.district_origin),
            sector: report.sector || (report.samples?.[0]?.sector),
            cell: report.cell || (report.samples?.[0]?.cell),
            village: report.village || (report.samples?.[0]?.village)
          }}
          title="Sample Collection Location"
        />
      </div>
      
      {editingSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Sample</h3>
              <button onClick={() => setEditingSample(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Farmer Name</label>
                <input 
                  type="text" 
                  value={editingSample.farmer_name || ''}
                  onChange={e => setEditingSample({...editingSample, farmer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={editingSample.phone || ''}
                  onChange={e => setEditingSample({...editingSample, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District Origin</label>
                <input 
                  type="text" 
                  value={editingSample.district_origin || ''}
                  onChange={e => setEditingSample({...editingSample, district_origin: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <input 
                  type="text" 
                  value={editingSample.sector || ''}
                  onChange={e => setEditingSample({...editingSample, sector: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cell</label>
                <input 
                  type="text" 
                  value={editingSample.cell || ''}
                  onChange={e => setEditingSample({...editingSample, cell: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
                <input 
                  type="text" 
                  value={editingSample.village || ''}
                  onChange={e => setEditingSample({...editingSample, village: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specie</label>
                <input 
                  type="text" 
                  value={editingSample.specie || ''}
                  onChange={e => setEditingSample({...editingSample, specie: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Animal ID</label>
                <input 
                  type="text" 
                  value={editingSample.animal_id || ''}
                  onChange={e => setEditingSample({...editingSample, animal_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
                <input 
                  type="text" 
                  value={editingSample.breed || ''}
                  onChange={e => setEditingSample({...editingSample, breed: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
                <input 
                  type="text" 
                  value={editingSample.sex || ''}
                  onChange={e => setEditingSample({...editingSample, sex: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="text" 
                  value={editingSample.age || ''}
                  onChange={e => setEditingSample({...editingSample, age: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vaccination Status</label>
                <input 
                  type="text" 
                  value={editingSample.vaccination_status || ''}
                  onChange={e => setEditingSample({...editingSample, vaccination_status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                <input 
                  type="text" 
                  value={editingSample.purpose || ''}
                  onChange={e => setEditingSample({...editingSample, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Health Status</label>
                <input 
                  type="text" 
                  value={editingSample.health_status || ''}
                  onChange={e => setEditingSample({...editingSample, health_status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingSample(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await axios.put(`/rvf-api/surveillance/samples/${editingSample.id}`, editingSample);
                    addToast('success', 'Sample updated successfully');
                    setEditingSample(null);
                    if (onClose) onClose(); // close to refresh data
                  } catch (error) {
                    addToast('error', 'Failed to update sample');
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
    </div>
  );
}

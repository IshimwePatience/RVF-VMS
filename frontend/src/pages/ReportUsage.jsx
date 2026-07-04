import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import minisanteLogo from '../assets/images/MINISANTE.png';

export default function ReportUsage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    doses_used: '',
    doses_wasted: '',
    domestic_animals_vaccinated: '',
    animals_affected: '',
    animals_healed: '',
    animals_died: ''
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/administrations/report/${token}`);
        setRecord(res.data);
        
        // Pre-fill form if already submitted
        if (res.data.report_status === 'submitted') {
          setFormData({
            doses_used: res.data.doses_used ?? '',
            doses_wasted: res.data.doses_wasted ?? '',
            domestic_animals_vaccinated: res.data.domestic_animals_vaccinated ?? '',
            animals_affected: res.data.animals_affected ?? '',
            animals_healed: res.data.animals_healed ?? '',
            animals_died: res.data.animals_died ?? ''
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        doses_used: parseInt(formData.doses_used) || 0,
        doses_wasted: parseInt(formData.doses_wasted) || 0,
        domestic_animals_vaccinated: parseInt(formData.domestic_animals_vaccinated) || 0,
        animals_affected: parseInt(formData.animals_affected) || 0,
        animals_healed: parseInt(formData.animals_healed) || 0,
        animals_died: parseInt(formData.animals_died) || 0
      };
      
      const res = await axios.post(`http://localhost:3001/api/administrations/report/${token}`, payload);
      setRecord(res.data.record);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-slate-600">Loading form...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl w-full border-t-8 border-red-500 text-center">
          <h2 className="text-2xl font-normal text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {success && (
          <div className="bg-green-50 text-green-800 rounded-xl p-6 border border-green-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Response recorded successfully!</h3>
            <p className="text-sm">Thank you for submitting your usage report. You can safely close this page, or you may continue to edit your response below if you need to make changes.</p>
          </div>
        )}

        {/* Header Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-3 bg-blue-600"></div>
          <div className="p-8">
            <img src={minisanteLogo} alt="MINISANTE" className="h-12 object-contain mb-6" />
            <h1 className="text-3xl font-normal text-[#202124] mb-3">Vaccine Usage Report</h1>
            <p className="text-sm text-slate-600 mb-6">
              Please fill out this form to report the usage of the vaccines distributed to you. 
              Your response can be updated later if needed.
            </p>
            <div className="border-t border-slate-200 pt-4 text-[13px] text-slate-500 space-y-1">
              <p><b>Veterinary:</b> {record.veterinary_name}</p>
              <p><b>Batch:</b> {record.Batch?.batch_number}</p>
              <p><b>Total Quantity Received:</b> <span className="font-medium text-slate-800">{record.quantity} doses</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              How many doses were successfully used? <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0" max={record.quantity}
              value={formData.doses_used}
              onChange={(e) => {
                let val = e.target.value;
                if (val !== '' && parseInt(val) > record.quantity) {
                  val = record.quantity.toString();
                }
                setFormData({...formData, doses_used: val});
              }}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              How many doses were damaged or wasted? <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0" max={record.quantity}
              value={formData.doses_wasted}
              onChange={(e) => {
                let val = e.target.value;
                if (val !== '' && parseInt(val) > record.quantity) {
                  val = record.quantity.toString();
                }
                setFormData({...formData, doses_wasted: val});
              }}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
            {parseInt(formData.doses_wasted) > 0 && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded text-orange-800 text-[14px]">
                <b>⚠️ Note:</b> Any damaged doses must be physically returned to the sector to receive replacements.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Number of domestic animals vaccinated <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0"
              value={formData.domestic_animals_vaccinated}
              onChange={(e) => setFormData({...formData, domestic_animals_vaccinated: e.target.value})}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Number of animals affected (but not vaccinated) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0"
              value={formData.animals_affected}
              onChange={(e) => setFormData({...formData, animals_affected: e.target.value})}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Number of animals that healed <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0"
              value={formData.animals_healed}
              onChange={(e) => setFormData({...formData, animals_healed: e.target.value})}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Number of animals that died <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" required min="0"
              value={formData.animals_died}
              onChange={(e) => setFormData({...formData, animals_died: e.target.value})}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="flex justify-between items-center py-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-[14px] font-medium transition-colors disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setFormData({
                  doses_used: '', doses_wasted: '', domestic_animals_vaccinated: '', 
                  animals_affected: '', animals_healed: '', animals_died: ''
                });
                setSuccess(false);
              }}
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-[14px] font-medium transition-colors"
            >
              Clear form
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

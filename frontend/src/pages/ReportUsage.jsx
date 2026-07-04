import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import minisanteLogo from '../assets/images/MINISANTE.png';
import { ChevronRight, Syringe } from 'lucide-react';
import LoginSkeleton from '../components/LoginSkeleton';

export default function ReportUsage() {
  const { token } = useParams();
  const navigate = useNavigate();

  // State for email verification flow
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [emailError, setEmailError] = useState('');

  // State for report form
  const [loading, setLoading] = useState(!!token);
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
    animals_died: '',
    owner_name: '',
    owner_phone: '',
    owner_national_id: ''
  });

  // Fetch record if token is present
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/administrations/report/${token}`);
        setRecord(res.data);

        // Pre-fill form if already submitted
        if (res.data.report_status === 'submitted') {
          setFormData({
            doses_used: res.data.doses_used ?? '',
            doses_wasted: res.data.doses_wasted ?? '',
            domestic_animals_vaccinated: res.data.domestic_animals_vaccinated ?? '',
            animals_affected: res.data.animals_affected ?? '',
            animals_healed: res.data.animals_healed ?? '',
            animals_died: res.data.animals_died ?? '',
            owner_name: res.data.owner_name ?? '',
            owner_phone: res.data.owner_phone ?? '',
            owner_national_id: res.data.owner_national_id ?? ''
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

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setEmailError('');
    try {
      const res = await axios.post('/api/administrations/verify-veterinary', { email });
      if (res.data && res.data.length > 0) {
        navigate(`/veterinary-portal/${encodeURIComponent(email)}`);
      } else {
        setEmailError('No records found for this email.');
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

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
        animals_died: parseInt(formData.animals_died) || 0,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        owner_national_id: formData.owner_national_id
      };

      const res = await axios.post(`/api/administrations/report/${token}`, payload);
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
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-slate-600">Loading...</div>;
  }

  if (error && token) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl w-full border-t-8 border-red-500 text-center">
          <h2 className="text-2xl font-normal text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  // STEP 1 & 2: Email Verification or List Selection if no token
  if (!token) {
    return (
      <LoginSkeleton>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] p-8 pt-10 relative overflow-hidden text-left border border-slate-200">

          <div className="mb-6">
            <h2 className="text-[22px] font-medium text-[#5f6368] tracking-tight leading-tight mb-2">
              Veterinary Portal
            </h2>
            <p className="text-[16px] text-[#373A3C] leading-normal">
              Enter your registered email address to access your vaccine usage reports.
            </p>
          </div>

          <form onSubmit={handleVerifyEmail}>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Email Address <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="e.g., vet@example.com"
              />
              {emailError && <p className="text-[#C02B0A] text-sm mt-2">{emailError}</p>}
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[12px] text-[#5f6368] leading-relaxed">
              I accept rvf vaccine hub's <a href="#" className="underline hover:text-[#0056D2]">Terms of Use</a> and <a href="#" className="underline hover:text-[#0056D2]">Privacy Notice</a>.
              <br /><br />
              This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#0056D2]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#0056D2]">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </LoginSkeleton>
    );
  }

  // STEP 3: Actual Report Form (when token is present)
  if (!record) return null;

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-4">

        {success && (
          <div className="bg-green-50 text-green-800 rounded-xl p-6 border border-green-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Response recorded successfully!</h3>
            <p className="text-sm mb-4">Thank you for submitting your usage report. You can safely close this page, or you may continue to edit your response below if you need to make changes.</p>
            <button
              onClick={() => navigate('/report-usage')}
              className="text-sm font-medium text-green-700 hover:text-green-900 underline"
            >
              ← Back to my reports
            </button>
          </div>
        )}

        {/* Header Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-3 bg-blue-600"></div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <img src={minisanteLogo} alt="MINISANTE" className="h-12 object-contain" />
              <button 
                onClick={() => {
                  navigate('/report-usage');
                  window.location.reload();
                }}
                className="text-sm font-medium text-slate-500 hover:text-red-600 hover:underline transition-colors"
              >
                Sign out
              </button>
            </div>
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
              Owner's Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Owner's Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required
              value={formData.owner_phone}
              onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Owner's National ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required
              value={formData.owner_national_id}
              onChange={(e) => setFormData({ ...formData, owner_national_id: e.target.value })}
              placeholder="Your answer"
              className="w-full sm:w-1/2 outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <label className="block text-[15px] font-medium text-[#202124] mb-4">
              Number of Doses Used <span className="text-red-500">*</span>
            </label>
            <input
              type="number" min="0" required
              value={formData.doses_used}
              onChange={(e) => {
                let val = e.target.value;
                if (val !== '' && parseInt(val) > record.quantity) {
                  val = record.quantity.toString();
                }
                setFormData({ ...formData, doses_used: val });
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
                setFormData({ ...formData, doses_wasted: val });
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
              onChange={(e) => setFormData({ ...formData, domestic_animals_vaccinated: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, animals_affected: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, animals_healed: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, animals_died: e.target.value })}
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

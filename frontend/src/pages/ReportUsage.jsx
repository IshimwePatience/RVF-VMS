import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import minisanteLogo from '../assets/images/MINISANTE.png';
import { ChevronRight, Syringe } from 'lucide-react';
import LoginSkeleton from '../components/LoginSkeleton';
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';

export default function ReportUsage({ mode = 'login' }) {
  const { token } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const { addToast } = useContext(ToastContext);

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

  const { data: record, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['report', token],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/administrations/report/${token}`);
      return res.data;
    },
    enabled: !!token,
    retry: false
  });

  const { data: districtsWithStock = [] } = useQuery({
    queryKey: ['districts-with-stock'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/locations/districts-with-stock');
      return res.data;
    },
    enabled: mode === 'register'
  });

  const error = queryError ? (queryError.response?.data?.message || 'Failed to load report details.') : null;

  useEffect(() => {
    if (record && record.report_status === 'submitted') {
      setFormData({
        doses_used: record.doses_used ?? '',
        doses_wasted: record.doses_wasted ?? '',
        domestic_animals_vaccinated: record.domestic_animals_vaccinated ?? '',
        animals_affected: record.animals_affected ?? '',
        animals_healed: record.animals_healed ?? '',
        animals_died: record.animals_died ?? '',
        owner_name: record.owner_name ?? '',
        owner_phone: record.owner_phone ?? '',
        owner_national_id: record.owner_national_id ?? ''
      });
    }
  }, [record]);

  const [name, setName] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (payload) => axios.post('/rvf-api/auth/vet/login', payload),
    onSuccess: (res) => {
      // Store token and redirect
      localStorage.setItem('vet_token', res.data.token);
      localStorage.setItem('vet_user', JSON.stringify(res.data.user));
      navigate(`/veterinary-portal/${encodeURIComponent(phone)}`);
    },
    onError: (err) => {
      if (err.response?.status === 404 && mode === 'login') {
        addToast('This phone number is not registered. Please register first.', 'error');
      } else {
        addToast(err.response?.data?.message || 'Failed to login. Please try again.', 'error');
      }
    }
  });

  const handleVerifyPhone = (e) => {
    e.preventDefault();
    
    // Clean the phone number (remove spaces)
    const cleanPhone = phone.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(cleanPhone)) {
      addToast('Invalid Rwandan phone number. Format should be 078xxxxxxx', 'error');
      return;
    }
    loginMutation.mutate({ 
      phone_number: cleanPhone, 
      name: mode === 'register' ? name : undefined,
      district: mode === 'register' ? district : undefined 
    });
  };

  const submitMutation = useMutation({
    mutationFn: async (payload) => axios.post(`/rvf-api/administrations/report/${token}`, payload),
    onSuccess: (res) => {
      queryClient.setQueryData(['report', token], res.data.record);
      addToast('Response recorded successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to submit report', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
    submitMutation.mutate(payload);
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
              Enter your phone number to access your portal.
            </p>
          </div>

          <form onSubmit={handleVerifyPhone}>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Phone Number <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="e.g., 0783202922"
              />
            </div>
            
            {mode === 'register' && (
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                  Full Name <span className="text-[#C02B0A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                  placeholder="e.g., John Doe"
                />
              </div>
            )}
            
            {mode === 'register' && (
              <div className="mb-6">
                <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                  District <span className="text-[#C02B0A]">*</span>
                </label>
                <select
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] bg-white text-[#1F2432]"
                >
                  <option value="">Select your district</option>
                  {districtsWithStock.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Only districts with active stocks are shown.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium py-2.5 px-4 rounded transition-colors text-[14px] disabled:opacity-50 mb-4"
            >
              {loginMutation.isPending ? 'Processing...' : (mode === 'register' ? 'Register' : 'Login')}
            </button>
            
            <div className="text-center text-[14px] text-[#373A3C]">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => navigate('/veterinary-signup')} className="text-[#0b57d0] font-medium hover:underline focus:outline-none">Register here</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => navigate('/veterinary-login')} className="text-[#0b57d0] font-medium hover:underline focus:outline-none">Login here</button></>
              )}
            </div>
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

        {/* Header Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-3 bg-blue-600"></div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <img src={minisanteLogo} alt="MINISANTE" className="h-12 object-contain" />
              <button 
                onClick={() => {
                  navigate('/veterinary-login');
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
              type="tel" required
              minLength="10" maxLength="10"
              pattern="^250\d{7}$"
              title="Must start with 250 and be exactly 10 digits"
              value={formData.owner_phone}
              onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value.replace(/\D/g, '') })}
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
              minLength="16" maxLength="16"
              pattern="^\d{16}$"
              title="National ID must be exactly 16 digits"
              value={formData.owner_national_id}
              onChange={(e) => setFormData({ ...formData, owner_national_id: e.target.value.replace(/\D/g, '') })}
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
              disabled={submitMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-[14px] font-medium transition-colors disabled:opacity-70"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit'}
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


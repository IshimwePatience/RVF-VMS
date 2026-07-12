import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginSkeleton from '../components/LoginSkeleton';
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';

export default function LabAuth({ mode = 'login' }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const { addToast } = useContext(ToastContext);

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/locations/districts-with-stock').catch(() => ({ data: [] }));
      return res.data;
    },
    enabled: mode === 'register'
  });

  const loginMutation = useMutation({
    mutationFn: async (payload) => axios.post('/rvf-api/auth/lab-tech/login', payload),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = import.meta.env.BASE_URL + 'lab-portal';
    },
    onError: (err) => {
      if (err.response?.status === 404 && mode === 'login') {
        addToast('This phone number is not registered. Please register first.', 'error');
      } else {
        addToast(err.response?.data?.message || 'Failed to login. Please try again.', 'error');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanPhone = phone.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(cleanPhone)) {
      addToast('Invalid Rwandan phone number. Format should be 078xxxxxxx', 'error');
      return;
    }
    
    if (mode === 'register' && (!name || !district)) {
      addToast('Name and district are required to register.', 'error');
      return;
    }

    loginMutation.mutate({ 
      phone_number: cleanPhone, 
      name: mode === 'register' ? name : undefined,
      district: mode === 'register' ? district : undefined
    });
  };

  return (
    <LoginSkeleton>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] p-8 pt-10 relative overflow-hidden text-left border border-slate-200">
        <div className="mb-6">
          <h2 className="text-[22px] font-medium text-[#5f6368] tracking-tight leading-tight mb-2">
            Lab Technician Portal
          </h2>
          <p className="text-[16px] text-[#373A3C] leading-normal">
            {mode === 'login' 
              ? 'Enter your registered phone number to access the portal.' 
              : 'Register your details to start uploading results.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
              Phone Number <span className="text-[#C02B0A]">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
              placeholder="078..."
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
                placeholder="Enter your full name"
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Working District <span className="text-[#C02B0A]">*</span>
              </label>
              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] text-[#1F2432] bg-white"
              >
                <option value="">Select your district...</option>
                {districts.map(d => (
                  <option key={d.district} value={d.district}>{d.district}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Processing...' : (mode === 'login' ? 'Continue' : 'Complete Registration')}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => navigate('/lab-signup')}
              className="block text-left text-[#0056D2] text-[14px] hover:underline font-normal"
            >
              Don't have an account? Register here.
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/lab-login')}
              className="block text-left text-[#0056D2] text-[14px] hover:underline font-normal"
            >
              Already registered? Login here.
            </button>
          )}
        </div>

        <div className="text-[12px] text-[#5E6D7E] leading-[1.5] mt-6">
          I accept rvf vaccine hub's <a href="#" className="underline hover:text-[#1F2432]">Terms of Use</a> and <a href="#" className="underline hover:text-[#1F2432]">Privacy Notice</a>. Having trouble logging in? <a href="#" className="underline hover:text-[#1F2432]">Help center</a>
          <br /><br />
          This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#1F2432]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#1F2432]">Terms of Service</a> apply.
        </div>
      </div>
    </LoginSkeleton>
  );
}

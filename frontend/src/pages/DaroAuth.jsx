import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoginSkeleton from '../components/LoginSkeleton';
import { ToastContext } from '../context/ToastContext';

export default function DaroAuth({ mode = 'login' }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [name, setName] = useState('');
  const { addToast } = useContext(ToastContext);

  const { data: districts = [] } = useQuery({
    queryKey: ['districts-with-stock'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/locations/districts-with-stock');
      return res.data;
    },
    enabled: mode === 'register'
  });

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const endpoint = mode === 'register' ? '/rvf-api/auth/daro/register' : '/rvf-api/auth/daro/login';
      return axios.post(endpoint, payload);
    },
    onSuccess: (res) => {
      localStorage.setItem('daro_token', res.data.token);
      localStorage.setItem('daro_user', JSON.stringify(res.data.user));
      navigate(`/daro-portal`);
    },
    onError: (err) => {
      if (err.response?.status === 404 && mode === 'login') {
        addToast('This phone number is not registered. Please register first.', 'error');
      } else {
        addToast(err.response?.data?.message || 'Failed to authenticate. Please try again.', 'error');
      }
    }
  });

  const handleVerifyPhone = (e) => {
    e.preventDefault();
    
    const cleanPhone = phone.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(cleanPhone)) {
      addToast('Invalid Rwandan phone number. Format should be 078xxxxxxx', 'error');
      return;
    }
    loginMutation.mutate({ 
      phone_number: cleanPhone, 
      full_names: mode === 'register' ? name : undefined,
      district: mode === 'register' ? district : undefined 
    });
  };

  return (
    <LoginSkeleton>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] p-8 pt-10 relative overflow-hidden text-left border border-slate-200">

        <div className="mb-6">
          <h2 className="text-[22px] font-medium text-[#5f6368] tracking-tight leading-tight mb-2">
            DARO Portal
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
                Full Names <span className="text-[#C02B0A]">*</span>
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
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
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
              <>Don't have an account? <button type="button" onClick={() => navigate('/daro-signup')} className="text-[#0b57d0] font-medium hover:underline focus:outline-none">Register here</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => navigate('/daro-login')} className="text-[#0b57d0] font-medium hover:underline focus:outline-none">Login here</button></>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import minisanteLogo from '../assets/images/MINISANTE.png';
import { ChevronRight } from 'lucide-react';
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
      // Just fetch all locations, or districts specifically. If we don't have a specific endpoint, we can use an existing one or hardcode it.
      // But we can just use the locations api if it exists. Let's use districts-with-stock as a proxy for valid districts.
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
      // Force a hard reload so AuthContext picks up the new token
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#12aeec] p-8 text-center text-white flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#12aeec] to-[#0d8abf] opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-lg mb-4">
              <img src={minisanteLogo} alt="MINISANTE Logo" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Lab Technician Portal</h1>
            <p className="text-blue-100 text-sm max-w-xs mx-auto">
              {mode === 'login' ? 'Enter your registered phone number to access the portal' : 'Register your details to start uploading results'}
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12aeec]/20 focus:border-[#12aeec] transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Working District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12aeec]/20 focus:border-[#12aeec] transition-all"
                    required
                  >
                    <option value="">Select your district...</option>
                    {districts.map(d => (
                      <option key={d.district} value={d.district}>{d.district}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12aeec]/20 focus:border-[#12aeec] transition-all"
                placeholder="078..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#12aeec] hover:bg-[#0d8abf] text-white py-3.5 px-4 rounded-xl font-bold tracking-wide shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? 'Processing...' : (mode === 'login' ? 'Login to Portal' : 'Complete Registration')}
              {!loginMutation.isPending && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => navigate('/lab-signup')} className="text-[#12aeec] font-semibold hover:underline">
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Already registered?{' '}
                <button onClick={() => navigate('/lab-login')} className="text-[#12aeec] font-semibold hover:underline">
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

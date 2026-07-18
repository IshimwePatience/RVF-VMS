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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
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
      if (res.data.requires_password_change) {
        setTempUserId(res.data.userId);
        setShowResetModal(true);
        addToast(res.data.message || 'Please set a new password.', 'info');
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = import.meta.env.BASE_URL + 'lab-portal';
      }
    },
    onError: (err) => {
      if (err.response?.status === 404 && mode === 'login') {
        addToast('This phone number is not registered. Please register first.', 'error');
      } else {
        addToast(err.response?.data?.message || 'Failed to login. Please try again.', 'error');
      }
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload) => axios.post('/rvf-api/auth/lab-tech/change-password', payload),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = import.meta.env.BASE_URL + 'lab-portal';
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to change password.', 'error');
    }
  });

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pwd)) return 'Password must contain at least one special character.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanPhone = phone.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(cleanPhone)) {
      addToast('Invalid Rwandan phone number. Format should be 078xxxxxxx', 'error');
      return;
    }
    
    if (mode === 'register' && !name) {
      addToast('Name is required to register.', 'error');
      return;
    }

    if (!password) {
      addToast('Password is required.', 'error');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        addToast('Passwords do not match.', 'error');
        return;
      }
      const pwdError = validatePassword(password);
      if (pwdError) {
        addToast(pwdError, 'error');
        return;
      }
    }

    loginMutation.mutate({ 
      phone_number: cleanPhone, 
      password,
      name: mode === 'register' ? name : undefined
    });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      addToast(pwdError, 'error');
      return;
    }
    resetPasswordMutation.mutate({
      userId: tempUserId,
      new_password: password
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

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
              Password <span className="text-[#C02B0A]">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
              placeholder="Enter your password"
            />
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Confirm Password <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="Confirm your password"
              />
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
          I accept Rvf Vet Input hub's <a href="#" className="underline hover:text-[#1F2432]">Terms of Use</a> and <a href="#" className="underline hover:text-[#1F2432]">Privacy Notice</a>. Having trouble logging in? <a href="#" className="underline hover:text-[#1F2432]">Help center</a>
          <br /><br />
          This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#1F2432]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#1F2432]">Terms of Service</a> apply.
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Set New Password</h3>
            </div>
            <form onSubmit={handleResetSubmit}>
              <div className="p-6 space-y-4 text-left">
                <p className="text-sm text-slate-600 mb-4">You are using a temporary password. Please set a new permanent password to continue.</p>
                <div>
                  <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                    New Password <span className="text-[#C02B0A]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px]"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                    Confirm New Password <span className="text-[#C02B0A]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px]"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {resetPasswordMutation.isPending ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LoginSkeleton>
  );
}

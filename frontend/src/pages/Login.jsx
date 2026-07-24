import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import LoginSkeleton from '../components/LoginSkeleton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // OTP State
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [otp, setOtp] = useState('');

  // Set Password State
  const [requiresPasswordSet, setRequiresPasswordSet] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingAuth, setPendingAuth] = useState(null);

  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/rvf-api/auth/login', { username, password });
      if (res.data.requires_otp) {
        setTempToken(res.data.tempToken);
        setRequiresOtp(true);
        addToast('OTP sent to your email', 'success');
      } else {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'Veterinary') {
          navigate(`/veterinary-portal/${res.data.user.email}`);
        } else if (res.data.user.role === 'Laboratory') {
          navigate('/lab-portal');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/rvf-api/auth/verify-otp', { tempToken, otp });
      if (res.data.user.must_change_password) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setPendingAuth({ token: res.data.token, user: res.data.user });
        setRequiresOtp(false);
        setRequiresPasswordSet(true);
      } else {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'Laboratory') {
          navigate('/lab-portal');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'OTP verification failed');
    }
  };
  const handleSetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    try {
      await axios.post('/rvf-api/auth/change-password', { newPassword: newPassword });
      const updatedUser = { ...pendingAuth.user, must_change_password: false };
      login(pendingAuth.token, updatedUser);
      addToast('Password set successfully', 'success');
      if (pendingAuth.user.role === 'Laboratory') {
        navigate('/lab-portal');
      } else {
        navigate('/');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to set password', 'error');
    }
  };
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/rvf-api/auth/request-reset', { username });
      addToast(res.data.message);
      setShowForgotPassword(false);
      setUsername('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit reset request');
    }
  };

  return (
    <LoginSkeleton>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[450px] p-8 pt-10 relative overflow-hidden text-left border border-slate-200">
        {/* Top brand header */}
        <div className="mb-6">
          <h2 className="text-[22px] font-medium text-[#5f6368] tracking-tight leading-tight mb-2">
            {showForgotPassword ? 'Reset Password' : requiresPasswordSet ? 'Set New Password' : requiresOtp ? 'Two-Factor Authentication' : 'Welcome to Rvf Vet Input hub'}
          </h2>
          <p className="text-[16px] text-[#373A3C] leading-normal">
            {showForgotPassword 
              ? 'Enter your username or email and we will send an approval request to the system administrator.'
              : requiresPasswordSet
                ? 'Please set a secure new password for your account. You will use this to log in moving forward.'
                : requiresOtp 
                  ? 'Please enter the 6-digit security code we just sent to your email to verify your identity.' 
                  : 'Securely manage and track national Rift Valley Fever vaccine distribution, real-time inventory, and dispatch.'}
          </p>
          {error && <p className="text-[#C02B0A] text-sm mt-4">{error}</p>}
        </div>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Username <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="name@email.com or username"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors"
            >
              Submit Reset Request
            </button>
            <div className="mt-6">
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(false)}
                className="block text-[14px] text-[#0056D2] hover:underline font-normal transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : requiresPasswordSet ? (
          <form onSubmit={handleSetPasswordSubmit}>
            <div className="mb-4">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                New Password <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] text-[#1F2432]"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Confirm Password <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] text-[#1F2432]"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
              <button
              type="submit"
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors"
            >
              Save Password & Login
            </button>
          </form>
        ) : !requiresOtp ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Username <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Password <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-[16px] placeholder-[#8A92A3] text-[#1F2432]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Proceeding...' : 'Proceed'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                OTP Code <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-center tracking-[0.5em] text-[20px] font-mono text-[#1F2432]"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors"
            >
              Verify & Login
            </button>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setRequiresOtp(false)}
                className="block text-[14px] text-[#0056D2] hover:underline font-normal transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {!requiresOtp && !requiresPasswordSet && !showForgotPassword && (
          <div className="mt-6 flex flex-col gap-2">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}
              className="block text-[#0056D2] text-[14px] hover:underline"
            >
              Forgot password?
            </a>
            <button
              onClick={() => navigate('/lab-login')}
              className="block text-left text-[#0056D2] text-[14px] hover:underline"
            >
              Are you a Lab Technician? Login here.
            </button>
            <button
              onClick={() => navigate('/veterinary-login')}
              className="block text-left text-[#0056D2] text-[14px] hover:underline"
            >
              Are you a Veterinary? Login here.
            </button>
          </div>
        )}
        <div className="text-[12px] text-[#5E6D7E] leading-[1.5] mt-6">
          I accept Rvf Vet Input hub's <a href="#" className="underline hover:text-[#1F2432]">Terms of Use</a> and <a href="#" className="underline hover:text-[#1F2432]">Privacy Notice</a>. Having trouble logging in? <a href="#" className="underline hover:text-[#1F2432]">Help center</a>
          <br /><br />
          This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#1F2432]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#1F2432]">Terms of Service</a> apply.
        </div>
      </div>
    </LoginSkeleton>
  );
}


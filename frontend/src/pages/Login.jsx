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

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // OTP State
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [otp, setOtp] = useState('');

  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/verify-otp', { tempToken, otp });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/request-reset', { username });
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
          <h2 className="text-[22px] font-bold text-[#1F2432] leading-tight mb-2">
            {showForgotPassword ? 'Reset Password' : requiresOtp ? 'Two-Factor Authentication' : 'Welcome to RVF VMS'}
          </h2>
          <p className="text-[16px] text-[#373A3C] leading-normal">
            {showForgotPassword 
              ? 'Enter your username or email and we will send an approval request to the system administrator.'
              : requiresOtp 
                ? 'Please enter the 6-digit security code we just sent to your email to verify your identity.' 
                : 'Securely manage and track national Rift Valley Fever vaccine distribution, real-time inventory, and dispatch.'}
          </p>
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
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(false)}
                className="text-[14px] text-[#0056D2] hover:underline font-normal transition-colors"
              >
                ← Back to Login
              </button>
            </div>
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
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors"
            >
              Continue
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
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setRequiresOtp(false)}
                className="text-[14px] text-[#0056D2] hover:underline font-normal transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {!requiresOtp && !showForgotPassword && (
          <div className="mt-6">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}
              className="block text-[#0056D2] text-[14px] hover:underline"
            >
              Forgot password?
            </a>
          </div>
        )}


        <div className="text-[12px] text-[#5E6D7E] leading-[1.5] mt-6">
          I accept RVF VMS's <a href="#" className="underline hover:text-[#1F2432]">Terms of Use</a> and <a href="#" className="underline hover:text-[#1F2432]">Privacy Notice</a>. Having trouble logging in? <a href="#" className="underline hover:text-[#1F2432]">Help center</a>
          <br /><br />
          This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#1F2432]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#1F2432]">Terms of Service</a> apply.
        </div>
      </div>
    </LoginSkeleton>
  );
}

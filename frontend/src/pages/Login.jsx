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

  // Set PIN State
  const [requiresPinSet, setRequiresPinSet] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pendingAuth, setPendingAuth] = useState(null);

  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      if (res.data.requires_otp) {
        setTempToken(res.data.tempToken);
        setRequiresOtp(true);
        addToast('OTP sent to your email', 'success');
      } else {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/verify-otp', { tempToken, otp });
      if (res.data.user.must_change_password) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setPendingAuth({ token: res.data.token, user: res.data.user });
        setRequiresOtp(false);
        setRequiresPinSet(true);
      } else {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'OTP verification failed');
    }
  };
  const handleSetPinSubmit = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    if (newPin.length < 6) {
      setError('PIN must be at least 6 characters');
      return;
    }
    setError('');
    try {
      await axios.post('http://localhost:3001/api/auth/change-password', { newPassword: newPin });
      const updatedUser = { ...pendingAuth.user, must_change_password: false };
      login(pendingAuth.token, updatedUser);
      navigate('/');
      addToast('PIN set successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to set PIN', 'error');
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
          <h2 className="text-[22px] font-medium text-[#5f6368] tracking-tight leading-tight mb-2">
            {showForgotPassword ? 'Reset Password' : requiresPinSet ? 'Set New PIN' : requiresOtp ? 'Two-Factor Authentication' : 'Welcome to rvf vaccine hub'}
          </h2>
          <p className="text-[16px] text-[#373A3C] leading-normal">
            {showForgotPassword 
              ? 'Enter your username or email and we will send an approval request to the system administrator.'
              : requiresPinSet
                ? 'Please set a secure new PIN for your account. You will use this to log in moving forward.'
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
        ) : requiresPinSet ? (
          <form onSubmit={handleSetPinSubmit}>
            <div className="mb-4">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                New PIN <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-center tracking-[0.5em] text-[20px] font-mono text-[#1F2432]"
                placeholder="••••••"
                minLength={6}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[14px] font-bold text-[#1F2432] mb-1.5">
                Confirm PIN <span className="text-[#C02B0A]">*</span>
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#8A92A3] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] outline-none transition-all text-center tracking-[0.5em] text-[20px] font-mono text-[#1F2432]"
                placeholder="••••••"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold text-[16px] py-3 rounded transition-colors"
            >
              Save PIN & Login
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

        {!requiresOtp && !requiresPinSet && !showForgotPassword && (
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
          I accept rvf vaccine hub's <a href="#" className="underline hover:text-[#1F2432]">Terms of Use</a> and <a href="#" className="underline hover:text-[#1F2432]">Privacy Notice</a>. Having trouble logging in? <a href="#" className="underline hover:text-[#1F2432]">Help center</a>
          <br /><br />
          This site is protected by reCAPTCHA Enterprise and the Google <a href="#" className="underline hover:text-[#1F2432]">Privacy Policy</a> and <a href="#" className="underline hover:text-[#1F2432]">Terms of Service</a> apply.
        </div>
      </div>
    </LoginSkeleton>
  );
}

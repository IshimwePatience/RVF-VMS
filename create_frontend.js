const fs = require('fs');
const path = require('path');

const dirs = [
  'frontend/src/components',
  'frontend/src/context',
  'frontend/src/pages'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const files = {
  'frontend/src/context/AuthContext.jsx': `import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Setup axios default
      axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
      
      // We would normally fetch current user profile here
      // For now we just mock it from token payload if we decode it, or rely on stored user
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      
      // Setup Socket
      const newSocket = io('http://localhost:3001', {
        auth: { token }
      });
      setSocket(newSocket);
      
      return () => newSocket.close();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      if (socket) socket.close();
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, socket, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  'frontend/src/components/Layout.jsx': `import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, Grid, Package, Settings, LogOut, Shield } from 'lucide-react';
import { Outlet, Navigate } from 'react-router-dom';

export default function Layout() {
  const { user, logout, token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2 text-primary font-bold text-lg">
          <Shield className="w-6 h-6 text-blue-600" />
          RVF VMS
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
            <Grid className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium transition-colors">
            <Package className="w-5 h-5" /> Inventory
          </a>
          {user?.is_central && (
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium transition-colors">
              <Settings className="w-5 h-5" /> Admin Settings
            </a>
          )}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-md font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex-1 flex items-center max-w-2xl bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search vaccines, batches, or requests..." 
              className="bg-transparent border-none outline-none w-full ml-3 text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-slate-900">{user?.username}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
`,
  'frontend/src/components/LoginSkeleton.jsx': `import React from 'react';
import { Search, Bell, Grid, Package, Shield } from 'lucide-react';

export default function LoginSkeleton({ children }) {
  return (
    <div className="relative h-screen w-full bg-slate-50 overflow-hidden">
      {/* Background Skeleton (Blurred out layout) */}
      <div className="absolute inset-0 skeleton-bg flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2 text-slate-300">
            <Shield className="w-6 h-6" /> RVF VMS
          </div>
          <nav className="flex-1 p-4 space-y-4">
            <div className="h-10 bg-slate-100 rounded-md w-full animate-pulse"></div>
            <div className="h-10 bg-slate-100 rounded-md w-full animate-pulse"></div>
            <div className="h-10 bg-slate-100 rounded-md w-full animate-pulse"></div>
          </nav>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-6">
             <div className="h-10 bg-slate-100 rounded-full flex-1 max-w-2xl animate-pulse"></div>
             <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse ml-auto"></div>
             <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse"></div>
          </header>
          <div className="p-6 grid grid-cols-3 gap-6">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="h-48 bg-white border border-slate-100 rounded-xl shadow-sm animate-pulse"></div>
             ))}
          </div>
        </div>
      </div>
      
      {/* Modal Overlay Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
        {children}
      </div>
    </div>
  );
}
`,
  'frontend/src/pages/Login.jsx': `import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginSkeleton from '../components/LoginSkeleton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // OTP State
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [otp, setOtp] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      if (res.data.requires_otp) {
        setRequiresOtp(true);
        setTempToken(res.data.tempToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <LoginSkeleton>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        {/* Top brand header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {requiresOtp ? 'Two-Factor Auth' : 'Log in to RVF VMS'}
          </h2>
          <p className="text-slate-500 mt-2 text-center text-sm">
            {requiresOtp ? 'Enter the 6-digit code sent to your email.' : 'Access your vaccine management dashboard.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!requiresOtp ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="name@email.com or username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md shadow-blue-600/20"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">OTP Code *</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center tracking-widest text-lg font-mono"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md shadow-blue-600/20"
            >
              Verify & Login
            </button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setRequiresOtp(false)}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-xs text-center text-slate-400 border-t border-slate-100 pt-6">
          Protected by RVF Security System. All accesses are monitored.
        </div>
      </div>
    </LoginSkeleton>
  );
}
`,
  'frontend/src/pages/Dashboard.jsx': `import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Vaccines</div>
          <div className="text-3xl font-bold text-slate-900">12,450</div>
          <div className="mt-2 text-sm text-green-600 font-medium">+15% this month</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Pending Requests</div>
          <div className="text-3xl font-bold text-slate-900">8</div>
          <div className="mt-2 text-sm text-orange-600 font-medium">Requires attention</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">In Transit</div>
          <div className="text-3xl font-bold text-slate-900">2</div>
          <div className="mt-2 text-sm text-blue-600 font-medium">Expected today</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Recent Activity
        </div>
        <div className="p-6 text-slate-500 text-sm text-center py-12">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
`,
  'frontend/src/App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* Add more routes here */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Frontend files generated.');

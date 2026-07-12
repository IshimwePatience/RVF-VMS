import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UploadCloud, List, TestTube } from 'lucide-react';
import UploadResultsTab from './UploadResultsTab';
import ViewResultsTab from './ViewResultsTab';
import SampleTestsTab from './SampleTestsTab';
import { useNavigate } from 'react-router-dom';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';

export default function LabPortal() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('samples');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/lab-login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src={minisanteLogo} alt="MINISANTE" className="h-8 object-contain" />
            <span className="text-[18px] text-[#5f6368] font-medium tracking-tight">rvf vaccine hub</span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-2 px-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lab Operations</h3>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('samples')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'samples' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <TestTube className="w-5 h-5" />
              Sample Tests
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <UploadCloud className="w-5 h-5" />
              Upload Results
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'view' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <List className="w-5 h-5" />
              View Results
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#9ca3af] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.charAt(0).toUpperCase() || user?.full_name?.charAt(0).toUpperCase() || 'L'}
              </div>
              <span className="truncate flex-1 text-left">{user?.name || user?.full_name || 'Lab Technician'}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            {activeTab === 'samples' && 'Surveillance Sample Tests'}
            {activeTab === 'upload' && 'Upload RVF Test Results'}
            {activeTab === 'view' && 'View Uploaded Results'}
          </h1>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {activeTab === 'samples' && <SampleTestsTab />}
            {activeTab === 'upload' && <UploadResultsTab />}
            {activeTab === 'view' && <ViewResultsTab isLabPortal={true} />}
          </div>
        </div>
      </main>
    </div>
  );
}

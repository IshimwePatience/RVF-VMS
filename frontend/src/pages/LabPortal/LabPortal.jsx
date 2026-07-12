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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3 shrink-0">
              <img src={minisanteLogo} alt="MINISANTE" className="h-10 object-contain" />
              <span className="text-[22px] text-[#5f6368] font-medium tracking-tight">rvf vaccine hub</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-[#9ca3af] text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                >
                  {user?.name?.charAt(0).toUpperCase() || user?.full_name?.charAt(0).toUpperCase() || 'L'}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">{user?.name || user?.full_name || 'Lab Technician'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden">
        
        {/* Sidebar styled exactly like Layout.jsx */}
        <div className="w-[280px] shrink-0 overflow-y-auto flex flex-col py-8 border-r border-slate-100 hidden md:flex">
          <div className="px-6 mb-2">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Lab Operations</h3>
            <nav className="space-y-1 flex flex-col">
              <button
                onClick={() => setActiveTab('samples')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-full transition-colors ${activeTab === 'samples' ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}
              >
                <TestTube className="w-4 h-4 shrink-0" />
                Sample Tests
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto w-full">
          {/* Top Horizontal Tabs */}
          <div className="flex mb-8">
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'samples' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <TestTube className="w-4 h-4 shrink-0" />
              Sample Tests
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              Upload Results
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'view' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <List className="w-4 h-4 shrink-0" />
              View Results
            </button>
          </div>

          {activeTab === 'samples' && <SampleTestsTab />}
          {activeTab === 'upload' && <UploadResultsTab />}
          {activeTab === 'view' && <ViewResultsTab isLabPortal={true} />}
        </main>
      </div>
    </div>
  );
}

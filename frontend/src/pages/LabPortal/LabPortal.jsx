import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UploadCloud, List } from 'lucide-react';
import UploadResultsTab from './UploadResultsTab';
import ViewResultsTab from './ViewResultsTab';
import { useNavigate } from 'react-router-dom';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';

export default function LabPortal() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upload');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                  {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'L'}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">{user?.full_name || 'Lab Technician'}</p>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Results
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'view' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" />
            View Results
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' ? <UploadResultsTab /> : <ViewResultsTab isLabPortal={true} />}
      </main>
    </div>
  );
}

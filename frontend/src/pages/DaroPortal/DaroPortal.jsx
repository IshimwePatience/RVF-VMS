import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';
import DaroSamplesTab from './DaroSamplesTab';
import DaroLabResultsTab from './DaroLabResultsTab';

export default function DaroPortal() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const activeTab = searchParams.get('tab') || localStorage.getItem('daroPortalActiveTab') || 'samples';

  useEffect(() => {
    const token = localStorage.getItem('daro_token');
    const userData = localStorage.getItem('daro_user');
    if (!token || !userData) {
      navigate('/daro-login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
    localStorage.setItem('daroPortalActiveTab', tab);
  };

  const handleSignOut = () => {
    localStorage.removeItem('daro_token');
    localStorage.removeItem('daro_user');
    navigate('/daro-login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3 shrink-0">
              <img src={minisanteLogo} alt="RAB" className="h-10 object-contain" />
              <span className="text-[22px] text-[#5f6368] font-medium tracking-tight">rvf vaccine hub</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-[#9ca3af] text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                >
                  {user.full_names ? user.full_names.charAt(0).toUpperCase() : 'D'}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">DARO - {user.district}</p>
                      <p className="text-xs text-slate-500">{user.full_names}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-6 md:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('samples')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'samples'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Samples
            </button>
            <button
              onClick={() => setActiveTab('lab_results')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'lab_results'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Lab Results
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'samples' && <DaroSamplesTab district={user.district} />}
          {activeTab === 'lab_results' && <DaroLabResultsTab district={user.district} />}
        </div>
      </div>
    </div>
  );
}

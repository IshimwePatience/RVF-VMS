import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import minisanteLogo from '../../assets/images/MINISANTE.png';
import OverviewTab from './OverviewTab';
import HomeVaccinationTab from './HomeVaccinationTab';
import SampleTestFormTab from './SampleTestFormTab';

export default function VeterinaryPortal() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(`vetPortalActiveTab_${phone}`) || 'overview');
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    if (phone) {
      localStorage.setItem(`vetPortalActiveTab_${phone}`, activeTab);
    }
  }, [activeTab, phone]);

  const handleSignOut = () => {
    navigate('/veterinary-login');
  };

  return (
    <div className="min-h-screen bg-white">
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
                  V
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">Veterinary</p>
                      <p className="text-xs text-slate-500">{phone}</p>
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
        <div className="border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-6 md:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vaccination')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'vaccination'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Home Vaccination Records
            </button>
            <button
              onClick={() => setActiveTab('sample_test')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sample_test'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Sample Test Form
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab email={email} />}
          {activeTab === 'vaccination' && <HomeVaccinationTab email={email} onSubmissionComplete={() => setActiveTab('overview')} />}
          {activeTab === 'sample_test' && <SampleTestFormTab email={email} />}
        </div>
      </div>
    </div>
  );
}

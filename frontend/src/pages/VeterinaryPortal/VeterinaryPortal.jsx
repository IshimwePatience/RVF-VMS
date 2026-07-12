import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import minisanteLogo from '../../assets/images/RAB_Logo2.png';
import OverviewTab from './OverviewTab';
import HomeVaccinationTab from './HomeVaccinationTab';
import SampleTestFormTab from './SampleTestFormTab';
import VetLabResultsTab from './VetLabResultsTab';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function VeterinaryPortal() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || localStorage.getItem(`vetPortalActiveTab_${phone}`) || 'overview';
  const [showDropdown, setShowDropdown] = useState(false);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const { data: settings = {} } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/settings/system');
      return res.data;
    }
  });

  const { data: todayResultsCount = 0 } = useQuery({
    queryKey: ['vet-today-results', phone],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/lab-results?vet_phone=${encodeURIComponent(phone)}`);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      return res.data.filter(r => r.createdAt && r.createdAt.startsWith(todayStr)).length;
    },
    enabled: !!phone
  });

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
        <div className="mb-6 overflow-x-auto scrollbar-hide">
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
            {settings.show_home_vaccination !== false && settings.show_home_vaccination !== 'false' && (
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
            )}
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
            <button
              onClick={() => setActiveTab('lab_results')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'lab_results'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Lab Results
              {todayResultsCount > 0 && (
                <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
                  {todayResultsCount} New Today
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab phone={phone} />}
          {activeTab === 'vaccination' && settings.show_home_vaccination !== false && settings.show_home_vaccination !== 'false' && <HomeVaccinationTab phone={phone} onSubmissionComplete={() => setActiveTab('overview')} />}
          {activeTab === 'sample_test' && <SampleTestFormTab phone={phone} />}
          {activeTab === 'lab_results' && <VetLabResultsTab phone={phone} />}
        </div>
      </div>
    </div>
  );
}

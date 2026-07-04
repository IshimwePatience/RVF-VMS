import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import minisanteLogo from '../../assets/images/MINISANTE.png';
import OverviewTab from './OverviewTab';
import HomeVaccinationTab from './HomeVaccinationTab';

export default function VeterinaryPortal() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = () => {
    navigate('/report-usage');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={minisanteLogo} alt="MINISANTE" className="h-10 object-contain mr-4" />
              <div>
                <h1 className="text-[26px] text-[#4b5563] font-normal tracking-wide">rvf vaccine hub</h1>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
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
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab email={email} />}
          {activeTab === 'vaccination' && <HomeVaccinationTab email={email} onSubmissionComplete={() => setActiveTab('overview')} />}
        </div>
      </div>
    </div>
  );
}

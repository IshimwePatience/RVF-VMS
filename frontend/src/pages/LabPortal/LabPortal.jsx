import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, UploadCloud, List, Beaker } from 'lucide-react';
import UploadResultsTab from './UploadResultsTab';
import ViewResultsTab from './ViewResultsTab';
import { useNavigate } from 'react-router-dom';

export default function LabPortal() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upload');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Laboratory Portal</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Upload & View RVF Results</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 leading-none">{user?.full_name || 'Lab Technician'}</div>
                <div className="text-xs text-slate-500 mt-1">{user?.email}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
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
        {activeTab === 'upload' ? <UploadResultsTab /> : <ViewResultsTab />}
      </main>
    </div>
  );
}

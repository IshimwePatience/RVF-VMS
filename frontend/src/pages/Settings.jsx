import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Settings() {
  const { user, login, token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [settings, setSettings] = useState({
    showHomeButton: false,
    showBookmarksBar: true,
    showTabSearch: true,
    showTabGroups: true,
    autoPinGroups: true,
    showTabImages: true,
    ...(user?.settings || {})
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setSettings(prev => ({ ...prev, ...user.settings }));
    }
  }, [user]);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:3001/api/auth/settings', { settings: newSettings });
      login(token, { ...user, settings: res.data });
    } catch (err) {
      setSettings(settings);
      addToast('Failed to save setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    const defaultSettings = {
      showHomeButton: false,
      showBookmarksBar: true,
      showTabSearch: true,
      showTabGroups: true,
      autoPinGroups: true,
      showTabImages: true,
    };
    
    setSettings(defaultSettings);
    try {
      const res = await axios.put('http://localhost:3001/api/auth/settings', { settings: defaultSettings });
      login(token, { ...user, settings: res.data });
      addToast('Settings reset to default', 'success');
    } catch (err) {
      addToast('Failed to reset settings', 'error');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto pb-12 pt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Theme</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">App Colors (White Theme)</p>
            </div>
            <button 
              onClick={resetToDefault}
              className="px-4 py-1.5 border border-slate-300 rounded-full text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset to default
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200">
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Customize your toolbar</h3>
          </div>

          <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div>
              <h3 className="text-[15px] font-medium text-slate-800">Mode</h3>
            </div>
            <select className="px-3 py-1.5 bg-slate-100 border border-transparent rounded text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer">
              <option>Device</option>
              <option>Compact</option>
              <option>Comfortable</option>
            </select>
          </div>

          <ToggleRow 
            title="Show home button" 
            subtitle={settings.showHomeButton ? 'Enabled' : 'Disabled'}
            checked={settings.showHomeButton} 
            onChange={(val) => updateSetting('showHomeButton', val)} 
          />
          <ToggleRow 
            title="Show bookmarks bar" 
            checked={settings.showBookmarksBar} 
            onChange={(val) => updateSetting('showBookmarksBar', val)} 
          />
          <ToggleRow 
            title="Show tab search button" 
            checked={settings.showTabSearch} 
            onChange={(val) => updateSetting('showTabSearch', val)} 
          />
          <ToggleRow 
            title="Show tab groups in bookmarks bar" 
            checked={settings.showTabGroups} 
            onChange={(val) => updateSetting('showTabGroups', val)} 
          />
          <ToggleRow 
            title="Automatically pin new tab groups created on any device" 
            checked={settings.autoPinGroups} 
            onChange={(val) => updateSetting('autoPinGroups', val)} 
          />
        </div>

        <div className="border-b border-slate-200">
          <div className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <h3 className="text-[15px] font-medium text-slate-800">Side panel position</h3>
            </div>
            <select className="px-3 py-1.5 bg-slate-100 border border-transparent rounded text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer">
              <option>Show on right</option>
              <option>Show on left</option>
            </select>
          </div>
        </div>

        <div>
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Tab hover preview card</h3>
          </div>
          
          <ToggleRow 
            title="Show tab preview images" 
            checked={settings.showTabImages} 
            onChange={(val) => updateSetting('showTabImages', val)} 
            isLast
          />
        </div>

      </div>
    </div>
  );
}

function ToggleRow({ title, subtitle, checked, onChange, isLast }) {
  return (
    <div className={`px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer ${!isLast ? 'border-b border-slate-100' : ''}`} onClick={() => onChange(!checked)}>
      <div>
        <h3 className="text-[15px] font-medium text-slate-800">{title}</h3>
        {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="ml-4 flex-shrink-0 flex items-center">
        <button 
          role="switch" 
          aria-checked={checked}
          onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
}

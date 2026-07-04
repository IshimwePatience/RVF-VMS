import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [rates, setRates] = useState({
    USD: 1300,
    EUR: 1400
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get('/api/settings/exchange-rates');
      const ratesMap = {};
      res.data.forEach(rate => {
        ratesMap[rate.currency] = rate.rate_to_rwf;
      });
      setRates(prev => ({ ...prev, ...ratesMap }));
    } catch (err) {
      console.error(err);
      addToast('Failed to load exchange rates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async (currency, rate) => {
    if (!rate || isNaN(rate)) return;
    setSaving(true);
    try {
      await axios.put(`/api/settings/exchange-rates/${currency}`, {
        rate_to_rwf: parseFloat(rate)
      });
      addToast(`${currency} rate updated successfully`, 'success');
      fetchRates();
    } catch (err) {
      console.error(err);
      addToast(`Failed to update ${currency} rate`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="max-w-[800px] mx-auto pb-12 pt-8 text-center text-slate-500">
        You do not have permission to view settings.
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pb-12 pt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage system-wide configuration and financial settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Currency Exchange Rates</h3>
          </div>
          
          <div className="px-8 py-6">
            <p className="text-sm text-slate-500 mb-6">
              Set the base conversion rates to Rwandan Francs (RWF). These values will be used across the app to calculate equivalent values in other currencies.
            </p>
            
            <div className="space-y-6">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <RateInput 
                    currency="USD" 
                    value={rates.USD} 
                    onSave={(val) => handleUpdateRate('USD', val)} 
                    saving={saving} 
                  />
                  <RateInput 
                    currency="EUR" 
                    value={rates.EUR} 
                    onSave={(val) => handleUpdateRate('EUR', val)} 
                    saving={saving} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RateInput({ currency, value, onSave, saving }) {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 font-semibold text-slate-800 text-[15px]">1 {currency} = </div>
      <div className="relative flex-1 max-w-[200px]">
        <input 
          type="number" 
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          placeholder="e.g. 1300"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
          RWF
        </div>
      </div>
      <button 
        onClick={() => onSave(localValue)}
        disabled={saving || Number(localValue) === Number(value)}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving && Number(localValue) !== Number(value) ? 'Saving...' : 'Update'}
      </button>
    </div>
  );
}


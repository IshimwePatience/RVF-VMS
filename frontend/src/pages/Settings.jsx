import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { data: fetchedRates, isLoading: loading } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/settings/exchange-rates');
      return res.data;
    }
  });

  const rates = { USD: 1300, EUR: 1400 };
  if (fetchedRates) {
    fetchedRates.forEach(rate => {
      rates[rate.currency] = rate.rate_to_rwf;
    });
  }

  const updateRateMutation = useMutation({
    mutationFn: async ({ currency, rate }) => {
      return axios.put(`/rvf-api/settings/exchange-rates/${currency}`, {
        rate_to_rwf: parseFloat(rate)
      });
    },
    onSuccess: (_, variables) => {
      addToast(`${variables.currency} rate updated successfully`, 'success');
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
    },
    onError: (err, variables) => {
      console.error(err);
      addToast(`Failed to update ${variables.currency} rate`, 'error');
    }
  });

  const handleUpdateRate = (currency, rate) => {
    if (!rate || isNaN(rate)) return;
    updateRateMutation.mutate({ currency, rate });
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="max-w-[800px] mx-auto pb-12 pt-8 text-center text-slate-500">
        You do not have permission to view settings.
      </div>
    );
  }

  return (
    <div className="pb-12 pt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage system-wide configuration and financial settings</p>
      </div>

      <div>
        <div>
          <div className="py-2">
            <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Currency Exchange Rates</h3>
          </div>
          
          <div className="py-4">
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
                    saving={updateRateMutation.isPending && updateRateMutation.variables?.currency === 'USD'} 
                  />
                  <RateInput 
                    currency="EUR" 
                    value={rates.EUR} 
                    onSave={(val) => handleUpdateRate('EUR', val)} 
                    saving={updateRateMutation.isPending && updateRateMutation.variables?.currency === 'EUR'} 
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="py-2">
            <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">System Toggles</h3>
          </div>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-6">
              Enable or disable specific features globally across the application.
            </p>
            <div className="space-y-6">
              <ToggleSetting 
                settingKey="show_home_vaccination" 
                label="Show Home Vaccination Records" 
                description="When enabled, the Home Vaccination Records tab will be visible in the Veterinary Portal."
              />
              <ToggleSetting 
                settingKey="show_vaccines_overview" 
                label="Show Vaccines Overview" 
                description="When enabled, the Vaccines Overview summary will be visible in the Veterinary Portal's Overview tab."
              />
              <ToggleSetting 
                settingKey="daro_approval_enabled" 
                label="Enable DARO Sample Approval" 
                description="When enabled, DAROs will be able to approve or reject samples in their portal."
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ToggleSetting({ settingKey, label, description }) {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/settings/system');
      return res.data;
    }
  });

  const value = settings[settingKey] !== false; // default true if undefined

  const mutation = useMutation({
    mutationFn: async (newValue) => {
      return axios.put(`/rvf-api/settings/system/${settingKey}`, { value: newValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      addToast('Setting updated successfully', 'success');
    },
    onError: () => {
      addToast('Failed to update setting', 'error');
    }
  });

  if (isLoading) return <div className="h-10 bg-slate-100 animate-pulse rounded-lg max-w-md"></div>;

  return (
    <div className="flex items-start justify-between max-w-2xl bg-white p-4 rounded-xl border border-slate-200">
      <div>
        <h4 className="text-[15px] font-semibold text-slate-800">{label}</h4>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <div className="flex items-center h-full pt-1">
        <input 
          type="checkbox" 
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
          checked={value}
          disabled={mutation.isPending}
          onChange={(e) => mutation.mutate(e.target.checked)}
        />
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


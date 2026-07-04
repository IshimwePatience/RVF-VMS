import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Package, CheckCircle, Truck } from 'lucide-react';

export default function Transfers() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const isCentral = user?.role === 'Admin' || user?.stock?.is_central || user?.is_central;
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(isCentral ? 'outgoing' : 'incoming');
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (user) {
      setActiveTab(isCentral ? 'outgoing' : 'incoming');
    }
  }, [user, isCentral]);

  useEffect(() => {
    let ignore = false;
    
    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/transfers?type=${activeTab}`);
        if (!ignore) {
          setTransfers(res.data);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          addToast('Failed to load transfers', 'error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchTransfers();
    }

    return () => { ignore = true; };
  }, [activeTab, user, addToast, fetchTrigger]);

  const handleConfirmReceipt = async (id) => {
    if (!window.confirm('Are you sure you have received this shipment? This will add the vaccines to your inventory.')) return;
    try {
      await axios.post(`http://localhost:3001/api/transfers/${id}/confirm`);
      addToast('Delivery confirmed and inventory updated!', 'success');
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to confirm delivery', 'error');
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Transit': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'In Transit': return 'Shipped';
      case 'Completed': return 'Received';
      default: return status;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Transfers & Deliveries</h1>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        {!isCentral && (
          <button 
            onClick={() => setActiveTab('incoming')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'incoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Package className="w-4 h-4" /> Incoming Deliveries
          </button>
        )}
        <button 
          onClick={() => setActiveTab('outgoing')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'outgoing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Truck className="w-4 h-4" /> Outgoing Shipments
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : transfers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src="/empty_mascot.png" alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No {activeTab} shipments found</h3>
            <p className="text-slate-500 mt-1">When shipments are dispatched, they will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 pr-6 font-semibold text-slate-800">Date Shipped</th>
                <th className="py-3 font-semibold text-slate-800">Batch ID</th>
                <th className="py-3 font-semibold text-slate-800">Quantity</th>
                <th className="py-3 font-semibold text-slate-800">Status</th>
                {activeTab === 'incoming' && <th className="py-3 font-semibold text-slate-800 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transfers.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-6">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 font-medium text-slate-900">{t.batch_id}</td>
                  <td className="py-4">
                    <span className="font-bold text-slate-900">{t.quantity.toLocaleString()}</span> doses
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(t.status)}`}>
                      {t.status === 'In Transit' && <Truck className="w-3.5 h-3.5" />}
                      {t.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {getStatusText(t.status)}
                    </span>
                  </td>
                  {activeTab === 'incoming' && (
                    <td className="py-4 text-right">
                      {t.status === 'In Transit' && (
                        <button 
                          onClick={() => handleConfirmReceipt(t.id)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

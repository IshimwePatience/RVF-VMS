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
  const [confirmingTransfer, setConfirmingTransfer] = useState(null);

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
        const res = await axios.get(`/rvf-api/transfers?type=${activeTab}`);
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

  const handleConfirmClick = (id) => {
    setConfirmingTransfer(id);
  };

  const submitConfirmReceipt = async (status) => {
    if (!confirmingTransfer) return;
    try {
      await axios.post(`/rvf-api/transfers/${confirmingTransfer}/confirm`, { status });
      addToast(status === 'Missing' ? 'Shipment reported as missing.' : 'Delivery confirmed and inventory updated!', 'success');
      setFetchTrigger(prev => prev + 1);
      setConfirmingTransfer(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update delivery status', 'error');
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Transit': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Missing': return 'bg-red-100 text-red-700';
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
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
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
                          onClick={() => handleConfirmClick(t.id)}
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

      {/* Confirmation Modal */}
      {confirmingTransfer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Confirm Delivery</h3>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6 font-medium">
                Are you sure you have received this shipment? If the shipment did not arrive, please report it as missing.
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmingTransfer(null)}
                  className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => submitConfirmReceipt('Missing')}
                  className="px-4 py-2 font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                >
                  Report Missing
                </button>
                <button 
                  onClick={() => submitConfirmReceipt('Completed')}
                  className="px-4 py-2 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm"
                >
                  Yes, I Received It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


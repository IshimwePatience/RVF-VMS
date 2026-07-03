import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Send, ChevronDown } from 'lucide-react';

export default function NewRequest() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [parentInventory, setParentInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, reqRes] = await Promise.all([
          axios.get('http://localhost:3001/api/inventory?view_parent=true'),
          axios.get('http://localhost:3001/api/requests?type=outgoing')
        ]);
        setParentInventory(invRes.data);
        setMyRequests(reqRes.data);
      } catch (err) {
        addToast('Failed to load available vaccines', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (!user?.is_central) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [addToast, user]);

  const handleQuantityChange = (batchId, value) => {
    setQuantities(prev => ({ ...prev, [batchId]: value }));
  };

  const handleRequest = async (item) => {
    const requested_quantity = parseInt(quantities[item.batch_id]);
    if (!requested_quantity || requested_quantity < 1) {
      return addToast('Please enter a valid quantity to request', 'error');
    }
    if (requested_quantity > item.quantity_available) {
      return addToast('Cannot request more than what is available', 'error');
    }

    setSubmitting(item.batch_id);
    try {
      await axios.post('http://localhost:3001/api/requests', {
        vaccine_id: item.Batch.vaccine_id,
        batch_id: item.batch_id,
        requested_quantity
      });
      addToast('Request sent successfully!', 'success');
      setQuantities(prev => ({ ...prev, [item.batch_id]: '' }));
      
      const reqRes = await axios.get('http://localhost:3001/api/requests?type=outgoing');
      setMyRequests(reqRes.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setSubmitting(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to stop this request?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/requests/${id}`);
      addToast('Request stopped successfully!', 'success');
      
      const reqRes = await axios.get('http://localhost:3001/api/requests?type=outgoing');
      setMyRequests(reqRes.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to stop request', 'error');
    }
  };

  if (user?.is_central) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Central Stock Cannot Make Requests</h2>
        <p className="text-slate-500 mt-2">Central stock receives vaccines directly from suppliers. You don't have a parent stock to request from.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Request Vaccines</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by</span>
            <button className="flex items-center justify-between gap-8 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              All <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <button className="flex items-center justify-between gap-8 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Most relevant <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : parentInventory.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src="/empty_mascot.png" alt="Empty Inventory Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No inventory found</h3>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                  Vaccine Name <ChevronDown className="w-4 h-4 text-slate-400" />
                </th>
                <th className="py-3 font-semibold text-slate-800">Batch</th>
                <th className="py-3 font-semibold text-slate-800">Available Stock</th>
                <th className="py-3 font-semibold text-slate-800">Expiration Date</th>
                <th className="py-3 font-semibold text-slate-800 w-64 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parentInventory.map(item => {
                const pendingRequest = myRequests.find(r => r.batch_id === item.batch_id && r.status === 'Pending');
                
                return (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{item.Batch?.Vaccine?.name}</span>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                        VACCINE
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600 font-medium">{item.Batch?.batch_number}</td>
                  <td className="py-4 text-slate-600">
                    <span className="font-bold text-slate-900">{item.quantity_available.toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    {item.Batch?.expiration_date ? new Date(item.Batch.expiration_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-4">
                    {pendingRequest ? (
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </span>
                        <button 
                          onClick={() => handleCancel(pendingRequest.id)}
                          className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors underline decoration-transparent hover:decoration-red-600"
                        >
                          Stop Request
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <input 
                          type="number"
                          placeholder="Qty"
                          min="1"
                          max={item.quantity_available}
                          value={quantities[item.batch_id] || ''}
                          onChange={(e) => handleQuantityChange(item.batch_id, e.target.value)}
                          className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-blue-500 transition-colors"
                        />
                        <button 
                          onClick={() => handleRequest(item)}
                          disabled={submitting === item.batch_id || !quantities[item.batch_id]}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {submitting === item.batch_id ? 'Sending...' : 'Request'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

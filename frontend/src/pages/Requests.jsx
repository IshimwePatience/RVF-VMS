import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Requests() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');

  useEffect(() => {
    fetchRequests();
    if (user && !(user?.role === 'Admin' || user?.stock?.is_central || user?.is_central)) {
      setActiveTab('outgoing');
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [reqRes, invRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/requests?type=${activeTab}`),
        axios.get('http://localhost:3001/api/inventory')
      ]);
      setRequests(reqRes.data);
      setInventory(invRes.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this request? This will deduct the requested amount from your inventory and initiate a transfer.')) return;
    try {
      await axios.post(`http://localhost:3001/api/requests/${id}/approve`);
      addToast('Request approved and shipped successfully!', 'success');
      fetchRequests();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    try {
      await axios.post(`http://localhost:3001/api/requests/${id}/reject`);
      addToast('Request rejected successfully!', 'success');
      fetchRequests();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reject request', 'error');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Waiting for Approval';
      case 'Approved': return 'Approved';
      case 'Rejected': return 'Rejected';
      default: return status;
    }
  };

  const getRemainingAmount = (batchId) => {
    const item = inventory.find(i => i.batch_id === batchId);
    return item ? item.quantity_available : 0;
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Requests</h1>
        {!(user?.role === 'Admin' || user?.stock?.is_central || user?.is_central) && (
          <Link to="/requests/new" className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            New Request
          </Link>
        )}
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'incoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Incoming Requests
        </button>
        {!(user?.role === 'Admin' || user?.stock?.is_central || user?.is_central) && (
          <button 
            onClick={() => setActiveTab('outgoing')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'outgoing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            My Requests
          </button>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : requests.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src="/empty_mascot.png" alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No {activeTab} requests found</h3>
            <p className="text-slate-500 mt-1">When requests are made, they will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 pr-6 font-semibold text-slate-800">Date</th>
                {activeTab === 'incoming' && <th className="py-3 font-semibold text-slate-800">Requested By</th>}
                <th className="py-3 font-semibold text-slate-800">Vaccine & Batch</th>
                <th className="py-3 font-semibold text-slate-800">Amount Requested</th>
                {activeTab === 'incoming' && <th className="py-3 font-semibold text-slate-800">Your Remaining Stock</th>}
                <th className="py-3 font-semibold text-slate-800">Status</th>
                {activeTab === 'incoming' && <th className="py-3 font-semibold text-slate-800 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => {
                const remaining = getRemainingAmount(req.batch_id);
                const hasEnough = remaining >= req.requested_quantity;
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-6">{new Date(req.createdAt).toLocaleDateString()}</td>
                    {activeTab === 'incoming' && (
                      <td className="py-4 font-medium text-slate-900">{req.RequestingStock?.name || 'Unknown'}</td>
                    )}
                    <td className="py-4">
                      <div className="font-medium text-slate-900">{req.Vaccine?.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Batch: {req.Batch?.batch_number}</div>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-slate-900">{req.requested_quantity.toLocaleString()}</span> doses
                    </td>
                    {activeTab === 'incoming' && (
                      <td className="py-4">
                        <div className={`font-medium ${remaining < req.requested_quantity ? 'text-red-600' : 'text-slate-700'}`}>
                          {remaining.toLocaleString()} doses
                        </div>
                        {req.status === 'Pending' && remaining < req.requested_quantity && (
                          <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Not enough stock</div>
                        )}
                      </td>
                    )}
                    <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(req.status)}`}>
                        {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {req.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                        {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {getStatusText(req.status)}
                      </span>
                    </td>
                    {activeTab === 'incoming' && (
                      <td className="py-4 text-right">
                        {req.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleReject(req.id)}
                              className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleApprove(req.id)}
                              disabled={!hasEnough}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${hasEnough ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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

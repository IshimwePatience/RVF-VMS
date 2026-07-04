import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Requests() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [approvedQuantity, setApprovedQuantity] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [viewingNote, setViewingNote] = useState(null);
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
        axios.get(`/rvf-api/requests?type=${activeTab}`),
        axios.get('/rvf-api/inventory')
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

  const handleApprove = async () => {
    if (!approvingRequest || !approvedQuantity) return;
    try {
      await axios.post(`/rvf-api/requests/${approvingRequest.id}/approve`, {
        approved_quantity: parseInt(approvedQuantity, 10),
        note: approvalNote
      });
      addToast('Request approved and shipped successfully!', 'success');
      setApprovingRequest(null);
      fetchRequests();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectingRequest || !rejectNote.trim()) return;
    try {
      await axios.post(`/rvf-api/requests/${rejectingRequest.id}/reject`, {
        note: rejectNote
      });
      addToast('Request rejected successfully!', 'success');
      setRejectingRequest(null);
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
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
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
                <th className="py-3 font-semibold text-slate-800 text-right">
                  {activeTab === 'incoming' ? 'Action / Note' : 'Note'}
                </th>
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
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(req.status)}`}>
                          {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {req.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                          {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                          {getStatusText(req.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      {activeTab === 'incoming' && req.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setRejectingRequest(req);
                              setRejectNote('');
                            }}
                            className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => {
                              setApprovingRequest(req);
                              setApprovedQuantity(req.requested_quantity);
                              setApprovalNote('');
                            }}
                            className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors bg-[#12aeec] text-white hover:bg-[#12aeec]/90"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                      {req.status !== 'Pending' && req.notes && (
                        <button 
                          onClick={() => setViewingNote(req.notes)}
                          className="text-[#12aeec] hover:underline font-bold text-xs"
                        >
                          Read Note
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {approvingRequest && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setApprovingRequest(null)}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setApprovingRequest(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Approve Request</h3>
                <p className="text-sm text-slate-500 mt-1">Specify the exact number of doses you want to approve and ship.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Amount</label>
                  <p className="text-sm font-medium text-slate-900">{approvingRequest.requested_quantity} doses</p>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available Stock</label>
                  <p className="text-sm font-medium text-slate-900">{getRemainingAmount(approvingRequest.batch_id)} doses</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity to Approve</label>
                  <input
                    type="number"
                    min="1"
                    max={getRemainingAmount(approvingRequest.batch_id)}
                    value={approvedQuantity}
                    onChange={(e) => {
                      let val = e.target.value;
                      const maxStock = getRemainingAmount(approvingRequest.batch_id);
                      if (val !== '' && parseInt(val, 10) > maxStock) {
                        val = maxStock.toString();
                      }
                      setApprovedQuantity(val);
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {approvingRequest.requested_quantity.toString() !== approvedQuantity.toString() && (
                  <div className="animate-[fadeIn_0.2s_ease-out]">
                    <label className="block text-[11px] font-bold text-[#12aeec] uppercase tracking-wider mb-2">Reason for change</label>
                    <textarea
                      value={approvalNote}
                      onChange={(e) => setApprovalNote(e.target.value)}
                      placeholder="Optional: Why are you approving a different amount?"
                      className="w-full px-4 py-2 bg-[#12aeec]/10 border border-[#12aeec]/30 rounded-lg outline-none focus:border-[#12aeec] transition-colors text-sm min-h-[80px]"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setApprovingRequest(null)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApprove}
                    disabled={!approvedQuantity || parseInt(approvedQuantity, 10) < 1 || parseInt(approvedQuantity, 10) > getRemainingAmount(approvingRequest.batch_id)}
                    className="px-6 py-2 bg-[#12aeec] text-white text-sm font-bold rounded-lg hover:bg-[#12aeec]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectingRequest && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setRejectingRequest(null)}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setRejectingRequest(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Reject Request</h3>
                <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejecting this request.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#12aeec] uppercase tracking-wider mb-2">Rejection Reason <span className="text-red-500">*</span></label>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Why are you rejecting this request?"
                    className="w-full px-4 py-2 bg-[#12aeec]/10 border border-[#12aeec]/30 rounded-lg outline-none focus:border-[#12aeec] transition-colors text-sm min-h-[100px]"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setRejectingRequest(null)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectNote.trim()}
                    className="px-6 py-2 bg-[#12aeec] text-white text-sm font-bold rounded-lg hover:bg-[#12aeec]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setViewingNote(null)}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setViewingNote(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">Admin Note</h3>
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                {viewingNote}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setViewingNote(null)}
                  className="px-6 py-2 bg-[#12aeec] text-white text-sm font-bold rounded-lg hover:bg-[#12aeec]/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


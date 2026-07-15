import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';
import { Send, ChevronDown, X, Clock } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function NewRequest() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState({});
  const [quantities, setQuantities] = useState({});
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [viewApprovals, setViewApprovals] = useState(null);

  const { data, isLoading: loading } = useQuery({
    queryKey: ['new-requests'],
    queryFn: async () => {
      const [invRes, reqRes] = await Promise.all([
        axios.get('/rvf-api/inventory?view_parent=true'),
        axios.get('/rvf-api/requests?type=outgoing')
      ]);
      return { parentInventory: invRes.data, myRequests: reqRes.data };
    },
    enabled: !!user && !user.is_central,
  });

  const parentInventory = data?.parentInventory || [];
  const myRequests = data?.myRequests || [];

  const handleQuantityChange = (batchId, value, maxAmount) => {
    let val = value;
    if (val !== '' && parseInt(val, 10) > maxAmount) {
      val = maxAmount.toString();
    }
    setQuantities(prev => ({ ...prev, [batchId]: val }));
  };

  const requestMutation = useMutation({
    mutationFn: async (payload) => axios.post('/rvf-api/requests', payload),
    onSuccess: (_, variables) => {
      addToast('Request sent successfully!', 'success');
      setQuantities(prev => ({ ...prev, [variables.batch_id]: '' }));
      queryClient.invalidateQueries({ queryKey: ['new-requests'] });
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to send request', 'error');
    },
    onSettled: (_, __, variables) => {
      setSubmitting(null);
    }
  });

  const handleRequest = (item) => {
    const requested_quantity = parseInt(quantities[item.batch_id]);
    if (!requested_quantity || requested_quantity < 1) {
      return addToast('Please enter a valid quantity to request', 'error');
    }
    if (requested_quantity > item.quantity_available) {
      return addToast('Cannot request more than what is available', 'error');
    }

    setSubmitting(item.batch_id);
    requestMutation.mutate({
      vaccine_id: item.Batch.vaccine_id,
      batch_id: item.batch_id,
      requested_quantity
    });
  };

  const cancelMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/requests/${id}`),
    onSuccess: () => {
      addToast('Request stopped successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['new-requests'] });
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to stop request', 'error');
    }
  });

  const handleCancel = (id) => {
    if (!window.confirm('Are you sure you want to stop this request?')) return;
    cancelMutation.mutate(id);
  };

  // Filtering and Sorting
  const getProcessedInventory = () => {
    let processed = [...parentInventory];

    // Filtering (All - currently no other status applies nicely to requests)

    // Sorting
    if (sortBy === 'Name A-Z') {
      processed.sort((a, b) => a.Batch.Vaccine.name.localeCompare(b.Batch.Vaccine.name));
    } else if (sortBy === 'Name Z-A') {
      processed.sort((a, b) => b.Batch.Vaccine.name.localeCompare(a.Batch.Vaccine.name));
    }

    return processed;
  };

  const processedInventory = getProcessedInventory();
  const pagination = usePagination(processedInventory, 12);

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
            <Dropdown 
              value={filterBy} 
              options={['All']} 
              onChange={setFilterBy} 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <Dropdown 
              value={sortBy} 
              options={['Name A-Z', 'Name Z-A']} 
              onChange={setSortBy} 
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : parentInventory.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty Inventory Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No inventory found</h3>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                    Vaccine Name <ChevronDown className="w-4 h-4 text-slate-400" />
                  </th>
                  <th className="py-3 font-semibold text-slate-800">Batch</th>
                  <th className="py-3 font-semibold text-slate-800">Available Stock</th>
                  <th className="py-3 font-semibold text-slate-800">Expiration Date</th>
                  <th className="py-3 font-semibold text-slate-800">Previous Approvals</th>
                  <th className="py-3 font-semibold text-slate-800 w-64 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.currentData.map(item => {
                  const activeRequest = myRequests.find(r => r.batch_id === item.batch_id && r.status === 'Pending');
                const approvedRequests = myRequests.filter(r => r.batch_id === item.batch_id && r.status === 'Approved').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                
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
                    {approvedRequests.length > 0 ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-sm font-semibold text-emerald-600">
                          {approvedRequests.length} Time{approvedRequests.length !== 1 ? 's' : ''}
                        </span>
                        <button 
                          onClick={() => setViewApprovals({ batch: item.Batch, requests: approvedRequests })}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider underline decoration-transparent hover:decoration-blue-600 transition-colors"
                        >
                          Check Approved
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-4">
                    {activeRequest ? (
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </span>
                        <button 
                          onClick={() => handleCancel(activeRequest.id)}
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
                          onChange={(e) => handleQuantityChange(item.batch_id, e.target.value, item.quantity_available)}
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
            <Pagination {...pagination} onPageChange={pagination.jump} />
          </>
        )}
      </div>

      {viewApprovals && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setViewApprovals(null)}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setViewApprovals(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Approval History</h3>
                <p className="text-sm text-slate-500">Batch {viewApprovals.batch.batch_number}</p>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {viewApprovals.requests.map((req, idx) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        #{viewApprovals.requests.length - idx}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{req.requested_quantity} doses</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(req.updatedAt).toLocaleString()}
                        </p>
                        {req.notes && (
                          <div className="mt-2 bg-amber-50 border border-amber-100 rounded p-2 text-xs text-amber-800">
                            <span className="font-bold">Note: </span>
                            {req.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100/50 px-2 py-1 rounded">Approved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


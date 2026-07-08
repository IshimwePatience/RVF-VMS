import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';
import LocationDropdown from '../components/LocationDropdown';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Stocks() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  // Create Stock Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    is_central: false,
    has_custom_name: false,
    is_endpoint: false,
    parent_stock_id: '',
    province: '',
    district: '',
    sector: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [viewStock, setViewStock] = useState(null);
  const [filterBy, setFilterBy] = useState(() => localStorage.getItem('stocksFilterBy') || 'All');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('stocksSortBy') || 'Hierarchy');

  useEffect(() => {
    localStorage.setItem('stocksFilterBy', filterBy);
    localStorage.setItem('stocksSortBy', sortBy);
  }, [filterBy, sortBy]);

  const { data: stocks = [], isLoading: loading } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/stocks');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return axios.put(`/rvf-api/stocks/${editingId}`, formData);
      } else {
        return axios.post('/rvf-api/stocks', formData);
      }
    },
    onSuccess: () => {
      addToast(editingId ? 'Stock point updated successfully' : 'Stock point created successfully', 'success');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save stock point', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', is_central: false, has_custom_name: false, is_endpoint: false, parent_stock_id: '', province: '', district: '', sector: '' });
  };

  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setFormData({ 
      name: stock.name, 
      is_central: stock.is_central,
      has_custom_name: !stock.is_central && stock.name && !stock.name.includes('District') && !stock.name.includes('Sector'),
      is_endpoint: stock.is_endpoint || false,
      parent_stock_id: stock.parent_stock_id || '',
      province: stock.province || '',
      district: stock.district || '',
      sector: stock.sector || ''
    });
    setShowModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/stocks/${id}`),
    onSuccess: () => {
      addToast('Stock point deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (err) => {
      console.error(err);
      addToast('Failed to delete stock point', 'error');
    }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this stock point?')) return;
    deleteMutation.mutate(id);
  };

  const centralStocks = stocks.filter(s => s.is_central);

  // Apply filtering and sorting
  const getProcessedStocks = () => {
    let processed = [...stocks];
    
    // Filtering
    if (filterBy === 'Central Hubs') {
      processed = processed.filter(s => s.is_central);
    } else if (filterBy === 'Subordinates') {
      processed = processed.filter(s => !s.is_central && !s.is_endpoint);
    } else if (filterBy === 'Endpoints') {
      processed = processed.filter(s => s.is_endpoint);
    }
    
    // Sorting
    if (sortBy === 'Name A-Z') {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Name Z-A') {
      processed.sort((a, b) => b.name.localeCompare(a.name));
    }
    // Hierarchy (default from DB) is preserved if no other sort
    
    return processed;
  };

  const processedStocks = getProcessedStocks();
  const pagination = usePagination(processedStocks, 12);

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Stock Network Overview</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by</span>
            <Dropdown 
              value={filterBy} 
              options={['All', 'Central Hubs', 'Subordinates', 'Endpoints']} 
              onChange={setFilterBy} 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <Dropdown 
              value={sortBy} 
              options={['Hierarchy', 'Name A-Z', 'Name Z-A']} 
              onChange={setSortBy} 
            />
          </div>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors ml-4"
            >
              <Plus className="w-4 h-4" />
              New Stock Point
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No stock points found.
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                    Stock <ChevronDown className="w-4 h-4 text-slate-400" />
                  </th>
                  <th className="py-3 font-semibold text-slate-800">Parent Stock</th>
                  <th className="py-3 font-semibold text-slate-800 w-24">More</th>
                  <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.currentData.map(stock => (
                  <tr key={stock.id} className="group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{stock.name}</span>
                      {stock.is_central && <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">CENTRAL HUB</span>}
                      {!stock.is_central && !stock.is_endpoint && <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">SUBORDINATE</span>}
                      {stock.is_endpoint && <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider">ENDPOINT</span>}
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">
                    {stock.ParentStock ? stock.ParentStock.name : (stock.is_central ? '—' : 'None Assigned')}
                  </td>
                  <td className="py-4">
                    <button 
                      onClick={() => setViewStock(stock)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(stock)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(stock.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <Pagination {...pagination} onPageChange={pagination.jump} />
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Stock Point' : 'Add New Stock Point'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm ${(!formData.is_central && !formData.has_custom_name) ? 'bg-slate-50 cursor-not-allowed text-slate-500' : 'bg-white'}`}
                    placeholder="e.g. Kigali District Stock"
                    readOnly={!formData.is_central && !formData.has_custom_name}
                  />
                  {(!formData.is_central && !formData.has_custom_name) && <p className="text-xs text-slate-500 mt-1">Name is automatically generated based on location selection.</p>}
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="is_central"
                    checked={formData.is_central}
                    onChange={(e) => setFormData({...formData, is_central: e.target.checked, parent_stock_id: '', has_custom_name: false})}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="is_central" className="text-sm font-medium text-slate-700">This is a Central Stock</label>
                </div>

                {!formData.is_central && (
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    <input 
                      type="checkbox" 
                      id="has_custom_name"
                      checked={formData.has_custom_name}
                      onChange={(e) => setFormData({...formData, has_custom_name: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="has_custom_name" className="text-sm font-medium text-slate-700">Custom Stock Name (Regional/Zipline)</label>
                  </div>
                )}

                {!formData.is_central && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Parent Stock</label>
                    <select 
                      value={formData.parent_stock_id}
                      onChange={(e) => setFormData({...formData, parent_stock_id: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    >
                      <option value="">Select a Parent Stock (Optional)</option>
                      {centralStocks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      {stocks.filter(s => !s.is_central && !s.is_endpoint && s.id !== formData.parent_stock_id).map(s => (
                         <option key={s.id} value={s.id}>{s.name} (Subordinate)</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1 mb-4">This stock will request vaccines from the assigned parent.</p>

                    <div className="grid grid-cols-2 gap-3 mt-3 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Province</label>
                        <div className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all text-sm bg-white">
                          <LocationDropdown 
                            type="provinces"
                            value={formData.province}
                            onChange={(val) => {
                              setFormData({ ...formData, province: val, district: '', sector: '' });
                            }}
                            placeholder="Select Province"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                        <div className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all text-sm bg-white">
                          <LocationDropdown 
                            type="districts"
                            params={{ province: formData.province }}
                            value={formData.district}
                            onChange={(val) => {
                              const newName = (!formData.is_endpoint && !formData.has_custom_name && val) ? `${val} District` : formData.name;
                              setFormData(prev => ({ ...prev, district: val, sector: '', name: newName }));
                              if (val && !formData.province) {
                                axios.get(`/rvf-api/locations/province-by-district?district=${val}`).then(res => {
                                  if (res.data.province) {
                                    setFormData(p => ({ ...p, province: res.data.province }));
                                  }
                                }).catch(() => {});
                              }
                            }}
                            placeholder="Select District"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="is_endpoint"
                        checked={formData.is_endpoint}
                        onChange={(e) => setFormData({...formData, is_endpoint: e.target.checked, sector: ''})}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <label htmlFor="is_endpoint" className="text-sm font-medium text-slate-700">This is an Endpoint Stock (Sector Level)</label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-6 mb-4">If checked, it distributes to Veterinaries.</p>

                    {formData.is_endpoint && (
                      <div className="pl-6 mt-3">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Sector</label>
                        <div className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all text-sm bg-white">
                          <LocationDropdown 
                            type="sectors"
                            params={{ district: formData.district }}
                            value={formData.sector}
                            onChange={(val) => {
                              const newName = (!formData.has_custom_name && val) ? `${val} Sector` : formData.name;
                              setFormData({...formData, sector: val, name: newName});
                            }}
                            placeholder="Select Sector"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
                >
                  {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Stock' : 'Create Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Stock Details Modal */}
      {viewStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Stock Details</h2>
              <button onClick={() => setViewStock(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stock Name</p>
                <p className="text-base font-medium text-slate-900">{viewStock.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</p>
                <div className="mt-1">
                  {viewStock.is_central && <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">Central Hub</span>}
                  {!viewStock.is_central && !viewStock.is_endpoint && <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">Subordinate</span>}
                  {viewStock.is_endpoint && <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Endpoint</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Parent Stock</p>
                <p className="text-sm font-medium text-slate-800">
                  {viewStock.ParentStock ? viewStock.ParentStock.name : (viewStock.is_central ? '— (Root)' : 'None Assigned')}
                </p>
              </div>
              
              {viewStock.is_endpoint && (
                <div className="pt-4 border-t border-slate-100 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Location Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Province</p>
                      <p className="text-sm font-medium text-slate-900">{viewStock.province || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">District</p>
                      <p className="text-sm font-medium text-slate-900">{viewStock.district || '—'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sector</p>
                      <p className="text-sm font-medium text-slate-900">{viewStock.sector || '—'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setViewStock(null)}
                className="px-5 py-2 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


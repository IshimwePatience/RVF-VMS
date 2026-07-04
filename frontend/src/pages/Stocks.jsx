import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';

export default function Stocks() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Stock Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    is_central: false,
    is_endpoint: false,
    parent_stock_id: '',
    province: '',
    district: '',
    sector: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [viewStock, setViewStock] = useState(null);
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Hierarchy');

  const fetchStocks = async () => {
    try {
      const res = await axios.get('/api/stocks');
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch stocks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/stocks/${editingId}`, formData);
        addToast('Stock point updated successfully', 'success');
      } else {
        await axios.post('/api/stocks', formData);
        addToast('Stock point created successfully', 'success');
      }
      closeModal();
      fetchStocks();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save stock point', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', is_central: false, is_endpoint: false, parent_stock_id: '', province: '', district: '', sector: '' });
  };

  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setFormData({ 
      name: stock.name, 
      is_central: stock.is_central, 
      is_endpoint: stock.is_endpoint || false,
      parent_stock_id: stock.parent_stock_id || '',
      province: stock.province || '',
      district: stock.district || '',
      sector: stock.sector || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock point?')) return;
    try {
      await axios.delete(`/api/stocks/${id}`);
      addToast('Stock point deleted successfully', 'success');
      fetchStocks();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete stock point', 'error');
    }
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
              {processedStocks.map(stock => (
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
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    placeholder="e.g. Kigali District Stock"
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-4 mb-2">
                  <input 
                    type="checkbox" 
                    id="is_central"
                    checked={formData.is_central}
                    onChange={(e) => setFormData({...formData, is_central: e.target.checked, parent_stock_id: ''})}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="is_central" className="text-sm font-medium text-slate-700">This is a Central Stock</label>
                </div>

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

                    <div className="flex items-center gap-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="is_endpoint"
                        checked={formData.is_endpoint}
                        onChange={(e) => setFormData({...formData, is_endpoint: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <label htmlFor="is_endpoint" className="text-sm font-medium text-slate-700">This is an Endpoint Stock (Distributes to Veterinaries)</label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-6 mb-4">If checked, no other stock can request from this one.</p>

                    {formData.is_endpoint && (
                      <div className="grid grid-cols-2 gap-3 pl-6 mt-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Province</label>
                          <input 
                            type="text" 
                            required={formData.is_endpoint}
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value})}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            placeholder="e.g. Kigali"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                          <input 
                            type="text" 
                            required={formData.is_endpoint}
                            value={formData.district}
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            placeholder="e.g. Gasabo"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Sector</label>
                          <input 
                            type="text" 
                            required={formData.is_endpoint}
                            value={formData.sector}
                            onChange={(e) => setFormData({...formData, sector: e.target.value})}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            placeholder="e.g. Kacyiru"
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
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Stock' : 'Create Stock'}
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

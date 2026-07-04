import React, { useState, useEffect, useContext } from 'react';
import { LayoutGrid, List, Plus, ChevronDown, Check, X, Search, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Receive Stock Modal State
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('batches');
  
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('inventoryViewMode') || 'grid');

  useEffect(() => {
    localStorage.setItem('inventoryViewMode', viewMode);
  }, [viewMode]);
  const [formData, setFormData] = useState({
    supplier_id: '',
    vaccine_id: '',
    batch_number: '',
    arrival_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    unit_per_container: '',
    number_of_containers: '',
    original_price_per_dose: '',
    currency: 'USD'
  });

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/inventory');
      setInventoryItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchOptions = async () => {
    try {
      const [suppRes, vacRes] = await Promise.all([
        axios.get('http://localhost:3001/api/suppliers'),
        axios.get('http://localhost:3001/api/vaccines')
      ]);
      setSuppliers(suppRes.data);
      setVaccines(vacRes.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load options', 'error');
    }
  };

  const openModal = () => {
    fetchOptions();
    setShowReceiveModal(true);
  };

  const handleReceiveStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/inventory/${editingId}`, formData);
        addToast('Stock updated successfully', 'success');
      } else {
        await axios.post('http://localhost:3001/api/inventory/receive', formData);
        addToast('Stock received successfully', 'success');
      }
      closeModal();
      fetchInventory();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowReceiveModal(false);
    setEditingId(null);
    setFormData({
      supplier_id: '', vaccine_id: '', batch_number: '', arrival_date: new Date().toISOString().split('T')[0], expiration_date: '', unit_per_container: '', number_of_containers: '', original_price_per_dose: '', currency: 'USD'
    });
  };

  const handleEdit = (item) => {
    fetchOptions();
    setEditingId(item.id);
    setFormData({
      supplier_id: item.Batch?.supplier_id || '',
      vaccine_id: item.Batch?.vaccine_id || '',
      batch_number: item.Batch?.batch_number || '',
      arrival_date: item.Batch?.arrival_date ? new Date(item.Batch.arrival_date).toISOString().split('T')[0] : '',
      expiration_date: item.Batch?.expiration_date ? new Date(item.Batch.expiration_date).toISOString().split('T')[0] : '',
      unit_per_container: item.Batch?.unit_per_container || '',
      number_of_containers: item.Batch?.number_of_containers || '',
      original_price_per_dose: item.Batch?.original_price_per_dose || '',
      currency: item.Batch?.currency || 'USD',
      quantity_available: item.quantity_available
    });
    setShowReceiveModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory record? This will also delete the associated batch if it exists.')) return;
    try {
      await axios.delete(`http://localhost:3001/api/inventory/${id}`);
      addToast('Inventory deleted successfully', 'success');
      fetchInventory();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete inventory', 'error');
    }
  };

  // Filtering and Sorting
  const getProcessedInventory = () => {
    let processed = [...inventoryItems];

    // Filtering
    const now = new Date();
    if (filterBy === 'Good Condition') {
      processed = processed.filter(item => new Date(item.Batch.expiration_date) > now);
    } else if (filterBy === 'Expired') {
      processed = processed.filter(item => new Date(item.Batch.expiration_date) <= now);
    }

    // Sorting
    if (sortBy === 'Name A-Z') {
      processed.sort((a, b) => a.Batch.Vaccine.name.localeCompare(b.Batch.Vaccine.name));
    } else if (sortBy === 'Quantity (High-Low)') {
      processed.sort((a, b) => b.quantity_available - a.quantity_available);
    } else if (sortBy === 'Quantity (Low-High)') {
      processed.sort((a, b) => a.quantity_available - b.quantity_available);
    }

    return processed;
  };

  const processedInventory = getProcessedInventory();

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Current Inventory</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by</span>
            <Dropdown 
              value={filterBy} 
              options={['All', 'Good Condition', 'Expired']} 
              onChange={setFilterBy} 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <Dropdown 
              value={sortBy} 
              options={['Name A-Z', 'Quantity (High-Low)', 'Quantity (Low-High)']} 
              onChange={setSortBy} 
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg ml-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
            <button 
              onClick={openModal}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors ml-4"
            >
              <Plus className="w-4 h-4" />
              Receive Vaccines
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('batches')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'batches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Received Shipments
        </button>
        <button 
          onClick={() => setActiveTab('balances')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'balances' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Vaccine Balances
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img 
                src="/empty_mascot.png" 
                alt="Empty Inventory Mascot" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No inventory found</h3>
          </div>
        ) : activeTab === 'balances' ? (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800">Vaccine Name</th>
                <th className="py-3 font-semibold text-slate-800">Total Received</th>
                <th className="py-3 font-semibold text-slate-800">Total Issued</th>
                <th className="py-3 font-semibold text-slate-800">Overall Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(() => {
                const balances = {};
                processedInventory.forEach(item => {
                  const vid = item.Batch.Vaccine.id;
                  if (!balances[vid]) {
                    balances[vid] = { vaccine: item.Batch.Vaccine, received: 0, issued: 0, balance: 0 };
                  }
                  balances[vid].received += item.quantity_available + (item.issued_quantity || 0);
                  balances[vid].issued += (item.issued_quantity || 0);
                  balances[vid].balance += item.quantity_available;
                });
                return Object.values(balances);
              })().map(b => (
                <tr key={b.vaccine.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{b.vaccine.name}</span>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">VACCINE</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">
                    <span className="font-medium text-slate-700">{b.received.toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    <span className="font-medium text-slate-700">{b.issued.toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    <span className="font-bold text-slate-900">{b.balance.toLocaleString()}</span> doses
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedInventory.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] cursor-pointer border border-transparent hover:border-slate-100 flex flex-col h-full">
                <div className={`h-36 rounded-xl w-full mb-4 flex items-center justify-center text-white font-bold text-xl relative overflow-hidden ${item.quantity_available < 5000 ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                    item.quantity_available < 15000 ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                      'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <span className="relative z-10 text-center px-4 drop-shadow-md">{item.Batch.Vaccine.name}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{item.Batch.Vaccine.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                    <span>Batch: {item.Batch.batch_number}</span>
                    {item.Batch.Supplier && (
                      <>
                        <span className="text-slate-300 mx-1">|</span>
                        <span className="text-blue-600 hover:underline">{item.Batch.Supplier.name}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Received: <span className="font-medium text-slate-800">{(item.quantity_available + (item.issued_quantity || 0)).toLocaleString()} doses</span>.
                    <br />
                    Issued: <span className="font-medium text-slate-800">{(item.issued_quantity || 0).toLocaleString()} doses</span>.
                    <br />
                    Balance: <span className="font-bold text-slate-900">{item.quantity_available.toLocaleString()} doses</span>.
                    <br />
                    Expires: {new Date(item.Batch.expiration_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                  Vaccine Name <ChevronDown className="w-4 h-4 text-slate-400" />
                </th>
                <th className="py-3 font-semibold text-slate-800">Batch</th>
                <th className="py-3 font-semibold text-slate-800">Received</th>
                <th className="py-3 font-semibold text-slate-800">Issued</th>
                <th className="py-3 font-semibold text-slate-800">Balance</th>
                <th className="py-3 font-semibold text-slate-800">Expiration Date</th>
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
                  <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
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
                    <span className="font-medium text-slate-700">{(item.quantity_available + (item.issued_quantity || 0)).toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    <span className="font-medium text-slate-700">{(item.issued_quantity || 0).toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    <span className="font-bold text-slate-900">{item.quantity_available.toLocaleString()}</span> doses
                  </td>
                  <td className="py-4 text-slate-600">
                    {item.Batch?.expiration_date ? new Date(item.Batch.expiration_date).toLocaleDateString() : 'N/A'}
                  </td>
                  {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop (No blur, just subtle dim) */}
          <div 
            className="fixed inset-0 bg-slate-900/40 transition-opacity"
            onClick={() => setShowReceiveModal(false)}
          ></div>
          
          {/* Sliding Drawer */}
          <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            
            {/* Header (No bottom border, spacious) */}
            <div className="px-10 pt-10 pb-6 shrink-0 relative">
              <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{editingId ? 'Edit Inventory' : 'Receive Vaccines'}</h2>
              <p className="text-[15px] text-slate-500 mt-1">{editingId ? 'Update details for this inventory batch' : 'Add a new batch to your central stock'}</p>
              
              <button 
                onClick={closeModal}
                className="absolute top-10 right-8 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {/* Arrow to line icon ->| */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h12"/>
                  <path d="m12 6 4 6-4 6"/>
                  <path d="M20 5v14"/>
                </svg>
              </button>
            </div>
            
            {/* Form Content */}
            <form onSubmit={handleReceiveStock} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
                
                {/* VACCINE INFO SECTION */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Vaccine *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.vaccine_id}
                        onChange={(e) => setFormData({...formData, vaccine_id: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="" disabled>Select a vaccine</option>
                        {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Supplier *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.supplier_id}
                        onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="" disabled>Select a supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Batch Number *</label>
                    <input 
                      type="text" required
                      placeholder="Enter batch number"
                      value={formData.batch_number}
                      onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* DATES SECTION */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Arrival Date</label>
                    <div className="relative">
                      <input 
                        type="date" required
                        value={formData.arrival_date}
                        onChange={(e) => setFormData({...formData, arrival_date: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium [&::-webkit-calendar-picker-indicator]:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Expiration Date</label>
                    <div className="relative">
                      <input 
                        type="date" required
                        value={formData.expiration_date}
                        onChange={(e) => setFormData({...formData, expiration_date: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium [&::-webkit-calendar-picker-indicator]:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* QUANTITY SECTION */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Units per Container</label>
                    <input 
                      type="number" required min="1" placeholder="e.g. 50"
                      value={formData.unit_per_container}
                      onChange={(e) => setFormData({...formData, unit_per_container: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Number of Containers</label>
                    <input 
                      type="number" required min="1" placeholder="e.g. 10"
                      value={formData.number_of_containers}
                      onChange={(e) => setFormData({...formData, number_of_containers: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* PRICING SECTION */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Price per Dose</label>
                    <input 
                      type="number" step="0.01" required min="0" placeholder="0.00"
                      value={formData.original_price_per_dose}
                      onChange={(e) => setFormData({...formData, original_price_per_dose: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Currency</label>
                    <div className="relative">
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="USD">USD</option>
                        <option value="RWF">RWF</option>
                        <option value="EUR">EUR</option>
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Buttons */}
              <div className="p-8 pb-10 flex items-center justify-end gap-6 shrink-0">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="text-slate-600 font-semibold text-[13px] tracking-wide hover:text-slate-900 transition-colors uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] tracking-wide rounded transition-colors uppercase disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Inventory' : 'Confirm Receipt'}
                </button>
              </div>
            </form>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}} />
        </div>
      )}
    </div>
  );
}

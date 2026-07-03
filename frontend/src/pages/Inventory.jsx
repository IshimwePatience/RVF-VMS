import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

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
      await axios.post('http://localhost:3001/api/inventory/receive', formData);
      addToast('Stock received successfully', 'success');
      setShowReceiveModal(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to receive stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Current Inventory</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img 
                src="/empty_mascot.png" 
                alt="Empty Inventory Mascot" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No inventory found</h3>
          </div>
        ) : inventoryItems.map((item) => (
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
                Available stock: <span className="font-medium text-slate-800">{item.quantity_available.toLocaleString()} doses</span>.
                <br />
                Expires: {new Date(item.Batch.expiration_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
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
              <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">Receive Vaccines</h2>
              <p className="text-[15px] text-slate-500 mt-1">Add a new batch to your central stock</p>
              
              <button 
                onClick={() => setShowReceiveModal(false)}
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
                  onClick={() => setShowReceiveModal(false)}
                  className="text-slate-600 font-semibold text-[13px] tracking-wide hover:text-slate-900 transition-colors uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-3 bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold text-[13px] tracking-wide rounded transition-colors uppercase disabled:opacity-70"
                >
                  {submitting ? 'Receiving...' : 'Confirm Receipt'}
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

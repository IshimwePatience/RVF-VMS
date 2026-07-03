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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Receive Vaccines (Central Stock)</h2>
            </div>
            <form onSubmit={handleReceiveStock} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                  <select 
                    required
                    value={formData.supplier_id}
                    onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  >
                    <option value="">Select Supplier...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vaccine</label>
                  <select 
                    required
                    value={formData.vaccine_id}
                    onChange={(e) => setFormData({...formData, vaccine_id: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  >
                    <option value="">Select Vaccine...</option>
                    {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                  <input 
                    type="text" required
                    value={formData.batch_number}
                    onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiration Date</label>
                  <input 
                    type="date" required
                    value={formData.expiration_date}
                    onChange={(e) => setFormData({...formData, expiration_date: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Units per Container</label>
                  <input 
                    type="number" required min="1"
                    value={formData.unit_per_container}
                    onChange={(e) => setFormData({...formData, unit_per_container: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Containers</label>
                  <input 
                    type="number" required min="1"
                    value={formData.number_of_containers}
                    onChange={(e) => setFormData({...formData, number_of_containers: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price per Dose</label>
                  <input 
                    type="number" step="0.01" required min="0"
                    value={formData.original_price_per_dose}
                    onChange={(e) => setFormData({...formData, original_price_per_dose: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="RWF">RWF</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowReceiveModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
                >
                  {submitting ? 'Receiving...' : 'Confirm Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

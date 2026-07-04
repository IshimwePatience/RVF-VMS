import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Search, Plus, Filter, MapPin, Syringe, ChevronDown } from 'lucide-react';

export default function Administration() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [administrations, setAdministrations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    quantity: '',
    veterinary_name: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    phone_number: '',
    national_id: '',
    email: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminRes, invRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/administrations?stock_id=${user?.stock?.id || ''}`),
        axios.get(`http://localhost:3001/api/inventory?stock_id=${user?.stock?.id || ''}`)
      ]);
      setAdministrations(adminRes.data);
      // Only include inventory that has available quantity
      setInventory(invRes.data.filter(item => item.quantity_available > 0));
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.stock?.id) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.batch_id || !formData.quantity || !formData.veterinary_name || !formData.province || !formData.district || !formData.sector || !formData.cell || !formData.village || !formData.phone_number || !formData.national_id || !formData.email) {
      return addToast('Please fill all fields', 'error');
    }
    
    const selectedItem = inventory.find(i => i.batch_id === formData.batch_id);
    if (!selectedItem || selectedItem.quantity_available < parseInt(formData.quantity)) {
      return addToast('Insufficient inventory available for this batch', 'error');
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:3001/api/administrations', {
        ...formData,
        stock_id: user.stock?.id,
        quantity: parseInt(formData.quantity)
      });
      addToast('Administration recorded successfully', 'success');
      setShowModal(false);
      setFormData({
        batch_id: '',
        quantity: '',
        veterinary_name: '',
        province: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        phone_number: '',
        national_id: '',
        email: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to record administration', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading administrations...</div>;
  }

  const selectedBatchItem = inventory.find(i => i.batch_id === formData.batch_id);
  const maxAvailable = selectedBatchItem ? selectedBatchItem.quantity_available : '';

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vaccine Administration</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Filter by</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-full pl-4 pr-10 py-1.5 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all">
                <option>All</option>
                <option>Today</option>
                <option>This Week</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors ml-4"
          >
            <Plus className="w-4 h-4" />
            Log Administration
          </button>
        </div>
      </div>

      <div className="mt-4">
        {administrations.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img 
                src="/empty_mascot.png" 
                alt="Empty Records Mascot" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No administration records found</h3>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800">Date</th>
                <th className="py-3 font-semibold text-slate-800">Veterinary</th>
                <th className="py-3 font-semibold text-slate-800">Vaccine</th>
                <th className="py-3 font-semibold text-slate-800">Doses</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-100">
                {administrations.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-slate-600">
                    {new Date(record.date_administered).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-6">
                    <span className="font-medium text-slate-900 text-base">{record.veterinary_name}</span>
                  </td>
                  <td className="py-4 text-slate-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 text-sm">{record.Batch?.Vaccine?.name}</span>
                      <span className="text-xs text-slate-500">Batch {record.Batch?.batch_number}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 text-xs font-bold">
                      <Syringe className="w-3.5 h-3.5" />
                      {record.quantity}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setShowModal(false)}>
          <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
            <div className="bg-white rounded-sm w-full max-w-[1100px] my-4 sm:my-8 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div className="px-10 pt-10 pb-6 shrink-0 relative">
                <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">Log Vaccine Administration</h2>
                <p className="text-[15px] text-slate-500 mt-1">Record vaccines distributed to veterinaries.</p>
                
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-10 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="px-10 pb-10">
              <form id="adminForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Vaccine Details */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Select Batch *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.batch_id}
                        onChange={(e) => setFormData({...formData, batch_id: e.target.value, quantity: ''})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="" disabled>Select a batch</option>
                        {inventory.map(item => (
                          <option key={item.batch_id} value={item.batch_id}>
                            {item.Batch?.Vaccine?.name} (Batch {item.Batch?.batch_number})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                      Doses Administered * {maxAvailable !== '' && <span className="text-blue-500 ml-1">(Max Available: {maxAvailable})</span>}
                    </label>
                    <input 
                      type="number" 
                      disabled={!formData.batch_id}
                      required min="1" max={maxAvailable}
                      placeholder={formData.batch_id ? "e.g. 50" : "Select batch first"}
                      value={formData.quantity}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val !== '' && maxAvailable !== '' && parseInt(val) > maxAvailable) {
                          val = maxAvailable.toString();
                        }
                        setFormData({...formData, quantity: val});
                      }}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Veterinary & Location */}
                <div className="space-y-8 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Veterinary Name *</label>
                    <input 
                      type="text" required
                      placeholder="Dr. John Doe"
                      value={formData.veterinary_name}
                      onChange={(e) => setFormData({...formData, veterinary_name: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Email Address *</label>
                    <input 
                      type="email" required
                      placeholder="vet@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Phone Number *</label>
                    <div className="flex items-center border-b border-slate-200 pb-2 focus-within:border-blue-500 transition-colors">
                      <span className="flex items-center gap-1.5 pr-3 text-[17px] text-slate-900 font-medium">
                        🇷🇼 +250
                      </span>
                      <input 
                        type="tel" required
                        placeholder="788 000 000"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        className="w-full bg-transparent outline-none text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">National ID *</label>
                    <input 
                      type="text" required maxLength="16"
                      placeholder="1 1990 8..."
                      value={formData.national_id}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setFormData({...formData, national_id: val});
                      }}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Province *</label>
                      <input 
                        type="text" required
                        placeholder="Province"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">District *</label>
                      <input 
                        type="text" required
                        placeholder="District"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Sector *</label>
                      <input 
                        type="text" required
                        placeholder="Sector"
                        value={formData.sector}
                        onChange={(e) => setFormData({...formData, sector: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Cell *</label>
                      <input 
                        type="text" required
                        placeholder="Cell"
                        value={formData.cell}
                        onChange={(e) => setFormData({...formData, cell: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Village *</label>
                      <input 
                        type="text" required
                        placeholder="Village"
                        value={formData.village}
                        onChange={(e) => setFormData({...formData, village: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-6 items-center">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="text-[13px] font-bold text-slate-500 hover:text-slate-800 tracking-wider transition-colors"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-6 py-3 bg-[#4384F5] text-white font-bold text-[13px] tracking-wider rounded transition-colors hover:bg-blue-600 disabled:opacity-70"
                  >
                    {submitting ? 'RECORDING...' : 'RECORD'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

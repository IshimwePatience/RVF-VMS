import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Search, Plus, Filter, MapPin, Syringe } from 'lucide-react';

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
    village: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminRes, invRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/administrations?stock_id=${user?.stock_id || ''}`),
        axios.get(`http://localhost:3001/api/inventory?stock_id=${user?.stock_id || ''}`)
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
    if (user?.stock_id) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.batch_id || !formData.quantity || !formData.veterinary_name || !formData.province || !formData.district || !formData.sector || !formData.cell || !formData.village) {
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
        stock_id: user.stock_id,
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
        village: ''
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

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vaccine Administration</h1>
          <p className="text-sm text-slate-500 mt-1">Record vaccines distributed to veterinaries.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Log Administration
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by veterinary or location..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        {administrations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No administration records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Veterinary</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Vaccine</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Doses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {administrations.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(record.date_administered).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {record.veterinary_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{record.veterinary_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[200px]" title={`${record.village}, ${record.cell}, ${record.sector}, ${record.district}, ${record.province}`}>
                          {record.village}, {record.cell}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 text-sm">{record.Batch?.Vaccine?.name}</span>
                        <span className="text-xs text-slate-500">Batch {record.Batch?.batch_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 text-xs font-bold">
                        <Syringe className="w-3.5 h-3.5" />
                        {record.quantity}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-blue-600" />
                Log Vaccine Administration
              </h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="adminForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Vaccine Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                      <select 
                        required
                        value={formData.batch_id}
                        onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option value="">-- Choose available batch --</option>
                        {inventory.map(item => (
                          <option key={item.batch_id} value={item.batch_id}>
                            {item.Batch?.Vaccine?.name} (Batch {item.Batch?.batch_number}) - {item.quantity_available} avail.
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Doses Administered</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white"
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Veterinary & Location</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Veterinary Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.veterinary_name}
                        onChange={(e) => setFormData({...formData, veterinary_name: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                        <input type="text" required value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                        <input type="text" required value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                        <input type="text" required value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cell</label>
                        <input type="text" required value={formData.cell} onChange={(e) => setFormData({...formData, cell: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
                        <input type="text" required value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-white shrink-0">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="adminForm"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
              >
                {submitting ? 'Saving...' : 'Record Administration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

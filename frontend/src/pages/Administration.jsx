import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';
import { Search, Plus, Filter, MapPin, Syringe, ChevronDown, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

export default function Administration() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [administrations, setAdministrations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [veterinaries, setVeterinaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterBy, setFilterBy] = useState('All');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formData, setFormData] = useState({
    batch_id: '',
    quantity: '',
    veterinary_id: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminRes, invRes, vetRes] = await Promise.all([
        axios.get(`/rvf-api/administrations?stock_id=${user?.stock?.id || ''}`),
        axios.get(`/rvf-api/inventory?stock_id=${user?.stock?.id || ''}`),
        axios.get(`/rvf-api/veterinaries`)
      ]);
      setAdministrations(adminRes.data);
      // Only include inventory that has available quantity
      setInventory(invRes.data.filter(item => item.quantity_available > 0));
      setVeterinaries(vetRes.data);
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
    if (!formData.batch_id || !formData.quantity || !formData.veterinary_id) {
      return addToast('Please fill all fields', 'error');
    }
    
    const selectedItem = inventory.find(i => i.batch_id === formData.batch_id);
    
    // For updates, the item might not exist in inventory if quantity_available is 0 now.
    // We only enforce inventory check strictly if creating new, or if increasing quantity.
    if (!selectedRecord) {
      if (!selectedItem || selectedItem.quantity_available < parseInt(formData.quantity)) {
        return addToast('Insufficient inventory available for this batch', 'error');
      }
    } else {
      if (parseInt(formData.quantity) > selectedRecord.quantity) {
        const diff = parseInt(formData.quantity) - selectedRecord.quantity;
        if (!selectedItem || selectedItem.quantity_available < diff) {
          return addToast('Insufficient inventory available to increase quantity', 'error');
        }
      }
    }

    setSubmitting(true);
    try {
      const selectedVet = veterinaries.find(v => v.id === formData.veterinary_id);
      
      const payload = {
        batch_id: formData.batch_id,
        quantity: parseInt(formData.quantity),
        veterinary_name: selectedVet.name,
        email: selectedVet.email,
        phone_number: selectedVet.phone_number,
        national_id: selectedVet.national_id,
        province: selectedVet.province,
        district: selectedVet.district,
        sector: selectedVet.sector,
        cell: selectedVet.cell,
        village: selectedVet.village
      };

      if (selectedRecord) {
        await axios.put(`/rvf-api/administrations/${selectedRecord.id}`, payload);
        addToast('Administration updated successfully', 'success');
      } else {
        await axios.post('/rvf-api/administrations', {
          ...payload,
          stock_id: user.stock?.id
        });
        addToast('Administration recorded successfully', 'success');
      }
      setShowModal(false);
      setSelectedRecord(null);
      setFormData({
        batch_id: '', quantity: '', veterinary_id: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save administration', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? The stock will be returned to inventory.')) return;
    try {
      await axios.delete(`/rvf-api/administrations/${id}`);
      addToast('Administration deleted successfully', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to delete administration', 'error');
    }
  };

  const openUpdateModal = (record) => {
    // Find the veterinary that matches this record's national ID
    const matchingVet = veterinaries.find(v => v.national_id === record.national_id);
    
    setSelectedRecord(record);
    setFormData({
      batch_id: record.batch_id,
      quantity: record.quantity.toString(),
      veterinary_id: matchingVet ? matchingVet.id : ''
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading administrations...</div>;
  }

  // Filtering
  const getProcessedAdministrations = () => {
    let processed = [...administrations];
    const now = new Date();
    
    if (filterBy === 'Today') {
      processed = processed.filter(a => {
        const d = new Date(a.date_administered);
        return d.toDateString() === now.toDateString();
      });
    } else if (filterBy === 'This Week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      processed = processed.filter(a => new Date(a.date_administered) >= oneWeekAgo);
    }

    return processed;
  };

  const processedAdministrations = getProcessedAdministrations();

  const selectedItem = inventory.find(i => i.batch_id === formData.batch_id);
  const maxAvailable = selectedItem ? selectedItem.quantity_available + (selectedRecord ? selectedRecord.quantity : 0) : '';

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vaccine Administration</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Filter by</span>
            <Dropdown 
              value={filterBy} 
              options={['All', 'Today', 'This Week']} 
              onChange={setFilterBy} 
            />
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
                src={`${import.meta.env.BASE_URL}empty_mascot.png`} 
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
                <th className="py-3 font-semibold text-slate-800">Status</th>
                <th className="py-3 font-semibold text-slate-800 text-right pr-4">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-100">
                {processedAdministrations.map(record => (
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
                  <td className="py-4">
                    {record.report_status === 'submitted' ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Done</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="py-4 text-right pr-4 relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === record.id ? null : record.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdown === record.id && (
                      <div className="absolute right-8 top-12 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 text-left">
                        <button 
                          onClick={() => { setViewRecord(record); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-slate-400" /> View Details
                        </button>
                        {record.report_status !== 'submitted' && (
                          <>
                            <button 
                              onClick={() => { openUpdateModal(record); setActiveDropdown(null); }}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4 text-slate-400" /> Update
                            </button>
                            <button 
                              onClick={() => { handleDelete(record.id); setActiveDropdown(null); }}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4 text-slate-400" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewRecord && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={() => setViewRecord(null)}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setViewRecord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Veterinary Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Name</span>
                    <span className="text-sm text-slate-800">{viewRecord.veterinary_name}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Phone Number</span>
                    <span className="text-sm text-slate-800">{viewRecord.phone_number}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">National ID</span>
                    <span className="text-sm text-slate-800">{viewRecord.national_id}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Email</span>
                    <span className="text-sm text-slate-800">{viewRecord.email}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">Location</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-xs text-slate-500">Province:</span> <span className="text-sm">{viewRecord.province}</span></div>
                    <div><span className="text-xs text-slate-500">District:</span> <span className="text-sm">{viewRecord.district}</span></div>
                    <div><span className="text-xs text-slate-500">Sector:</span> <span className="text-sm">{viewRecord.sector}</span></div>
                    <div><span className="text-xs text-slate-500">Cell:</span> <span className="text-sm">{viewRecord.cell}</span></div>
                    <div className="col-span-2"><span className="text-xs text-slate-500">Village:</span> <span className="text-sm">{viewRecord.village}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900">Log Vaccine Administration</h2>
            </div>
            
            <div className="overflow-y-auto">
              <form id="adminForm" onSubmit={handleSubmit} className="p-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.batch_id}
                        onChange={(e) => setFormData({...formData, batch_id: e.target.value, quantity: ''})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                      >
                        <option value="" disabled>Select a batch</option>
                        {inventory.map(item => (
                          <option key={item.batch_id} value={item.batch_id}>
                            {item.Batch?.Vaccine?.name} (Batch {item.Batch?.batch_number})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                      <span>Doses Administered *</span>
                      {maxAvailable !== '' && <span className="text-blue-500 text-xs font-normal">Max: {maxAvailable}</span>}
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Veterinary *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.veterinary_id}
                        onChange={(e) => setFormData({...formData, veterinary_id: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                      >
                        <option value="" disabled>Select a veterinary</option>
                        {veterinaries.map(vet => (
                          <option key={vet.id} value={vet.id}>
                            {vet.name} - {vet.phone_number} ({vet.sector})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-[#12aeec] hover:bg-[#12aeec]/90 text-white rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


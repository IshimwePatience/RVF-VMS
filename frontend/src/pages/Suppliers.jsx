import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Suppliers() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_info: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch suppliers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/suppliers/${editingId}`, formData);
        addToast('Supplier updated successfully', 'success');
      } else {
        await axios.post('http://localhost:3001/api/suppliers', formData);
        addToast('Supplier created successfully', 'success');
      }
      closeModal();
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save supplier', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', contact_info: '' });
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id);
    setFormData({ name: supplier.name, contact_info: supplier.contact_info || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/suppliers/${id}`);
      addToast('Supplier deleted successfully', 'success');
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete supplier', 'error');
    }
  };

  const hasAccess = user?.is_central || user?.stock?.is_central || user?.role?.toLowerCase() === 'admin';

  if (!hasAccess) {
    return (
      <div className="max-w-[1200px] mx-auto pb-12 pt-8 text-center text-slate-500">
        You do not have permission to view suppliers.
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
        
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
              Name A-Z <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors ml-4"
          >
            <Plus className="w-4 h-4" />
            New Supplier
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No suppliers found. Click "New Supplier" to add one.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                  Supplier Name <ChevronDown className="w-4 h-4 text-slate-400" />
                </th>
                <th className="py-3 font-semibold text-slate-800">Contact Information</th>
                <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map(supplier => (
                <tr key={supplier.id} className="group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{supplier.name}</span>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                        REGISTERED SUPPLIER
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600 whitespace-pre-wrap">{supplier.contact_info}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(supplier)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
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
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Information</label>
                  <textarea 
                    value={formData.contact_info}
                    onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm h-32 resize-none"
                    placeholder="Email, Phone, Address, etc."
                  ></textarea>
                </div>
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
                  {submitting ? 'Saving...' : editingId ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

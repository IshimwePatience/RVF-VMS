import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Vaccines() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const { data: vaccines = [], isLoading: loading } = useQuery({
    queryKey: ['vaccines'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/vaccines');
      return res.data;
    }
  });

  const pagination = usePagination(vaccines, 12);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return axios.put(`/rvf-api/vaccines/${editingId}`, formData);
      } else {
        return axios.post('/rvf-api/vaccines', formData);
      }
    },
    onSuccess: () => {
      addToast(editingId ? 'Vaccine updated successfully' : 'Vaccine created successfully', 'success');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save vaccine', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (vaccine) => {
    setEditingId(vaccine.id);
    setFormData({ name: vaccine.name, description: vaccine.description || '' });
    setShowModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/vaccines/${id}`),
    onSuccess: () => {
      addToast('Vaccine deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
    },
    onError: (err) => {
      console.error(err);
      addToast('Failed to delete vaccine', 'error');
    }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this vaccine?')) return;
    deleteMutation.mutate(id);
  };

  const hasAccess = user?.is_central || user?.stock?.is_central || user?.role?.toLowerCase() === 'admin';

  if (!hasAccess) {
    return (
      <div className="max-w-[1200px] mx-auto pb-12 pt-8 text-center text-slate-500">
        You do not have permission to manage vaccines.
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Vaccine Types</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors ml-4"
          >
            <Plus className="w-4 h-4" />
            New Vaccine
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : vaccines.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No vaccines found. Click "New Vaccine" to add one.
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                    Vaccine Name <ChevronDown className="w-4 h-4 text-slate-400" />
                  </th>
                  <th className="py-3 font-semibold text-slate-800">Description</th>
                  <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.currentData.map(vaccine => (
                  <tr key={vaccine.id} className="group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{vaccine.name}</span>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                        VACCINE
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 whitespace-pre-wrap">{vaccine.description}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(vaccine)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(vaccine.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
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
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Vaccine Type' : 'Create Vaccine Type'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vaccine Name</label>
                  <input
                    type="text" required
                    placeholder="e.g. RVF Live Attenuated"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    placeholder="Optional details about this vaccine..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm h-24 resize-none"
                  />
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
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
                >
                  {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Vaccine' : 'Create Vaccine'}
                </button>
              </div>
            </form>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}} />
        </div>
      )}
    </div>
  );
}


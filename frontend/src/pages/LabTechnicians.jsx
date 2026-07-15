import React, { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Power, PowerOff, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function LabTechnicians() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);

  const { data: labTechs = [], isLoading: loading } = useQuery({
    queryKey: ['lab-techs'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/auth/lab-techs');
      return res.data;
    },
    enabled: !!user && user.role === 'Admin'
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return axios.put(`/rvf-api/auth/lab-techs/${editingId}`, formData);
      } else {
        return axios.post('/rvf-api/auth/lab-techs', formData);
      }
    },
    onSuccess: () => {
      addToast(editingId ? 'Lab Technician updated successfully' : 'Lab Technician added successfully', 'success');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['lab-techs'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save lab technician', 'error');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }) => axios.put(`/rvf-api/auth/lab-techs/${id}`, { is_active }),
    onSuccess: (_, variables) => {
      addToast(`Lab Technician account ${variables.is_active ? 'activated' : 'stopped'} successfully`, 'success');
      queryClient.invalidateQueries({ queryKey: ['lab-techs'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', phone_number: '', is_active: true });
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', phone_number: '', is_active: true });
    setShowModal(true);
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    setFormData({
      name: v.name,
      phone_number: v.phone_number,
      is_active: v.is_active !== undefined ? v.is_active : true
    });
    setShowModal(true);
  };

  const handleToggleStatus = (v) => {
    const newStatus = v.is_active === false ? true : false;
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'stop'} this lab technician's account?`)) return;
    toggleStatusMutation.mutate({ id: v.id, is_active: newStatus });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/auth/lab-techs/${id}`),
    onSuccess: () => {
      addToast('Lab Technician deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['lab-techs'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to delete lab technician', 'error');
    }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this lab technician? This action cannot be undone.')) return;
    deleteMutation.mutate(id);
  };

  const filteredLabTechs = useMemo(() => {
    return labTechs.filter(v => {
      if (search) {
        const searchVal = search.toLowerCase();
        if (!JSON.stringify(v).toLowerCase().includes(searchVal)) return false;
      }
      return true;
    });
  }, [labTechs, search]);

  const pagination = usePagination(filteredLabTechs, 12);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  if (user?.role !== 'Admin') {
    return <div className="p-8 text-center text-slate-500">You do not have permission to view this page.</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12 pt-4">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lab Technicians</h1>
          <p className="text-slate-500 mt-1">Manage laboratory personnel accounts and access</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search technicians..." 
              value={search} 
              onChange={(e) => handleSearchChange(e.target.value)} 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Technician
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : labTechs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No lab technicians found</h3>
            <p className="text-slate-500 mt-1">When lab technicians register or are added, they will appear here.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800">Technician Name</th>
                  <th className="py-3 font-semibold text-slate-800">Phone Number</th>
                  <th className="py-3 font-semibold text-slate-800">Account Status</th>
                  <th className="py-3 font-semibold text-slate-800 w-32 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.currentData.map((v) => {
                  const isActive = v.is_active !== false;
                  return (
                    <tr key={v.id} className={`group hover:bg-slate-50/50 transition-colors ${!isActive ? 'opacity-60' : ''}`}>
                      <td className="py-4 pr-6">
                        <span className="font-medium text-slate-900 text-base">{v.name}</span>
                      </td>
                      <td className="py-4 text-slate-600">
                        <span>{v.phone_number}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isActive ? 'Active' : 'Stopped'}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleToggleStatus(v)} className={`${isActive ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'} transition-colors`} title={isActive ? "Stop Account" : "Activate Account"}>
                            {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleEdit(v)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Lab Technician' : 'Add New Lab Technician'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text" required
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text" required
                    placeholder="e.g. 0783202922"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

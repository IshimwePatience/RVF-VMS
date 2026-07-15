import React, { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronDown, Pencil, Trash2, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Users() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const availablePermissions = [
    { id: 'stock_overview', label: 'Stock Overview' },
    { id: 'inventory', label: 'Current Inventory' },
    { id: 'vaccines', label: 'Vaccine Types' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'veterinaries', label: 'Veterinaries' },
    { id: 'lab_technicians', label: 'Lab Technicians' },
    { id: 'new_request', label: 'New Request' },
    { id: 'administer', label: 'Administer Vaccines' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'reports', label: 'Reports' },
    { id: 'users', label: 'Users & Roles' },
    { id: 'settings', label: 'Settings' }
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role: 'Viewer',
    stock_id: '',
    settings: { permissions: [] }
  });
  const [editingId, setEditingId] = useState(null);

  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/users');
      return res.data;
    }
  });

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/stocks');
      return res.data;
    }
  });

  const filteredUsers = useMemo(() => {
    return users.filter(v => {
      if (search) {
        const searchVal = search.toLowerCase();
        if (!JSON.stringify(v).toLowerCase().includes(searchVal)) return false;
      }
      return true;
    });
  }, [users, search]);

  const pagination = usePagination(filteredUsers, 12);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return axios.put(`/rvf-api/users/${editingId}`, formData);
      } else {
        return axios.post('/rvf-api/users', formData);
      }
    },
    onSuccess: () => {
      addToast(editingId ? 'User updated successfully' : 'User created successfully. Credentials sent to email.', 'success');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save user', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ username: '', full_name: '', email: '', password: '', role: 'Viewer', stock_id: '', settings: { permissions: [] } });
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setFormData({
      username: u.username,
      full_name: u.full_name || '',
      email: u.email,
      password: '',
      role: u.role,
      stock_id: u.stock_id || '',
      settings: u.settings || { permissions: availablePermissions.map(p => p.id) }
    });
    setShowModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/users/${id}`),
    onSuccess: () => {
      addToast('User deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1">Manage system access and assign permissions</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search} 
              onChange={(e) => handleSearchChange(e.target.value)} 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                  User <ChevronDown className="w-4 h-4 text-slate-400" />
                </th>
                <th className="py-3 font-semibold text-slate-800">Full Names</th>
                <th className="py-3 font-semibold text-slate-800">Email</th>
                <th className="py-3 font-semibold text-slate-800">Assigned Stock Point</th>
                <th className="py-3 font-semibold text-slate-800">Status</th>
                <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagination.currentData.map((u) => (
                <tr key={u.id} className="group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-base">{u.username}</span>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">
                    {u.full_name || <span className="text-slate-400 italic">Not set</span>}
                  </td>
                  <td className="py-4 text-slate-600">
                    {u.email}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      {u.Stock ? u.Stock.name : <span className="text-slate-400 italic">Central/Global</span>}
                    </div>
                  </td>
                  <td className="py-4">
                    {u.must_change_password ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500 text-amber-600">
                        Pending Setup
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500 text-emerald-600">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(u)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination {...pagination} onPageChange={pagination.jump} />
        </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            <div className="px-6 pt-6 pb-4 shrink-0 relative">
              <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{editingId ? 'Edit User' : 'Add New User'}</h2>
              <p className="text-[15px] text-slate-500 mt-1">{editingId ? 'Update user roles and permissions' : 'Create an account and set permissions'}</p>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-10 right-8 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h12" /><path d="m12 6 4 6-4 6" /><path d="M20 5v14" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">

                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Username *</label>
                    <input
                      type="text" required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Full Names</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Email *</label>
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Password {editingId ? '' : '*'}</label>
                    <input
                      type="text" required={!editingId}
                      placeholder={editingId ? "Leave blank to keep current password" : "Assign an initial password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Role *</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="Viewer">Viewer (Read-only)</option>
                        <option value="Operations">Operations (Manage stock)</option>
                        <option value="Zipline">Zipline (Supply only)</option>
                        <option value="Admin">Admin (Full Access)</option>
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Assigned Stock Point</label>
                    <div className="relative">
                      <select
                        value={formData.stock_id}
                        onChange={(e) => setFormData({ ...formData, stock_id: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="">None (Global Access)</option>
                        {stocks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Leave blank if the user should have access to all stock points (typically Admins).</p>
                  </div>

                  {formData.role === 'Admin' && !formData.stock_id && (
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">Page Permissions</label>
                      <div className="grid grid-cols-2 gap-3">
                        {availablePermissions.map(perm => {
                          const isSelected = formData.settings?.permissions?.includes(perm.id);
                          return (
                            <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentPerms = formData.settings?.permissions || [];
                                  const newPerms = e.target.checked 
                                    ? [...currentPerms, perm.id] 
                                    : currentPerms.filter(p => p !== perm.id);
                                  setFormData({ ...formData, settings: { ...formData.settings, permissions: newPerms } });
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
                              />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{perm.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex gap-4">
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, settings: { ...formData.settings, permissions: availablePermissions.map(p => p.id) } })}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Select All
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, settings: { ...formData.settings, permissions: [] } })}
                          className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 pb-10 flex items-center justify-end gap-6 shrink-0 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-600 font-semibold text-[13px] tracking-wide hover:text-slate-900 transition-colors uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] tracking-wide rounded transition-colors uppercase disabled:opacity-70"
                >
                  {saveMutation.isPending ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Users() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Viewer',
    stock_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/stocks');
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStocks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/users/${editingId}`, formData);
        addToast('User updated successfully', 'success');
      } else {
        await axios.post('http://localhost:3001/api/users', formData);
        addToast('User created successfully. Credentials sent to email.', 'success');
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ username: '', email: '', role: 'Viewer', stock_id: '' });
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setFormData({
      username: u.username,
      email: u.email,
      role: u.role,
      stock_id: u.stock_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      addToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1">Manage system access and assign permissions</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3 font-semibold text-slate-800 flex items-center gap-1">
                  User <ChevronDown className="w-4 h-4 text-slate-400" />
                </th>
                <th className="py-3 font-semibold text-slate-800">Email</th>
                <th className="py-3 font-semibold text-slate-800">Assigned Stock Point</th>
                <th className="py-3 font-semibold text-slate-800">Status</th>
                <th className="py-3 font-semibold text-slate-800 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="group">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900 text-base">{u.username}</span>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                        {u.role}
                      </span>
                    </div>
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
                  <td colSpan="4" className="py-12 text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/40 transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            <div className="px-10 pt-10 pb-6 shrink-0 relative">
              <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{editingId ? 'Edit User' : 'Add New User'}</h2>
              <p className="text-[15px] text-slate-500 mt-1">{editingId ? 'Update user roles and permissions' : 'Create an account and set permissions'}</p>
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-10 right-8 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h12"/><path d="m12 6 4 6-4 6"/><path d="M20 5v14"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Username *</label>
                    <input 
                      type="text" required
                      placeholder="e.g. jdoe"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Email *</label>
                    <input 
                      type="email" required
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Role *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="Viewer">Viewer (Read-only)</option>
                        <option value="Operations">Operations (Manage stock)</option>
                        <option value="Admin">Admin (Full Access)</option>
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Assigned Stock Point</label>
                    <div className="relative">
                      <select 
                        value={formData.stock_id}
                        onChange={(e) => setFormData({...formData, stock_id: e.target.value})}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium appearance-none"
                      >
                        <option value="">None (Global Access)</option>
                        {stocks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <div className="absolute right-0 top-1 pointer-events-none text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Leave blank if the user should have access to all stock points (typically Admins).</p>
                  </div>
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
                  disabled={submitting}
                  className="px-6 py-3 bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold text-[13px] tracking-wide rounded transition-colors uppercase disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

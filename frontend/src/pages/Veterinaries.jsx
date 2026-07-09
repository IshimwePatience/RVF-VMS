import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Veterinaries() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  // Filters for Admin
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    national_id: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: ''
  });
  const [editingId, setEditingId] = useState(null);

  const { data: veterinaries = [], isLoading: loading } = useQuery({
    queryKey: ['veterinaries', provinceFilter, districtFilter, sectorFilter],
    queryFn: async () => {
      let url = '/rvf-api/veterinaries?';
      if (user?.role === 'Admin') {
        if (provinceFilter !== 'All') url += `province=${provinceFilter}&`;
        if (districtFilter !== 'All') url += `district=${districtFilter}&`;
        if (sectorFilter !== 'All') url += `sector=${sectorFilter}&`;
      }
      const res = await axios.get(url);
      return res.data;
    },
    enabled: !!user
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return axios.put(`/rvf-api/veterinaries/${editingId}`, formData);
      } else {
        return axios.post('/rvf-api/veterinaries', formData);
      }
    },
    onSuccess: () => {
      addToast(editingId ? 'Veterinary updated successfully' : 'Veterinary recorded successfully', 'success');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['veterinaries'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to save veterinary', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone_number: '', national_id: '', province: '', district: '', sector: '', cell: '', village: '' });
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    setFormData({
      name: v.name,
      email: v.email,
      phone_number: v.phone_number,
      national_id: v.national_id,
      province: v.province,
      district: v.district,
      sector: v.sector,
      cell: v.cell || '',
      village: v.village || ''
    });
    setShowModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/rvf-api/veterinaries/${id}`),
    onSuccess: () => {
      addToast('Veterinary deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['veterinaries'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to delete veterinary', 'error');
    }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this veterinary record?')) return;
    deleteMutation.mutate(id);
  };

  // Derive unique locations for filters based on the raw data (or hardcode/fetch from API ideally)
  // For now, we will extract them from the fetched veterinaries if they exist.
  // A robust system would fetch available provinces/districts/sectors from a Location API.
  const provinces = ['All', ...new Set(veterinaries.map(v => v.province))].filter(Boolean);
  const districts = ['All', ...new Set(veterinaries.map(v => v.district))].filter(Boolean);
  const sectors = ['All', ...new Set(veterinaries.map(v => v.sector))].filter(Boolean);
  const pagination = usePagination(veterinaries, 12);

  return (
    <div className="max-w-[1200px] mx-auto pb-12 pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Veterinaries</h1>
          <p className="text-slate-500 mt-1">Manage veterinary personnel in your sector</p>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'Admin' && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Province:</span>
                <Dropdown value={provinceFilter} options={provinces} onChange={setProvinceFilter} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">District:</span>
                <Dropdown value={districtFilter} options={districts} onChange={setDistrictFilter} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Sector:</span>
                <Dropdown value={sectorFilter} options={sectors} onChange={setSectorFilter} />
              </div>
            </>
          )}

          {user?.stock?.is_endpoint && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Veterinary
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : veterinaries.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="Empty Mascot" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No veterinaries found</h3>
            <p className="text-slate-500 mt-1">When veterinaries are added, they will appear here.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="py-3 font-semibold text-slate-800">Veterinary Name</th>
                  <th className="py-3 font-semibold text-slate-800">Contact Info</th>
                  <th className="py-3 font-semibold text-slate-800">Location</th>
                  {user?.stock?.is_endpoint && <th className="py-3 font-semibold text-slate-800 w-24 text-right pr-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.currentData.map((v) => (
                <tr key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-6">
                    <span className="font-medium text-slate-900 text-base">{v.name}</span>
                  </td>
                  <td className="py-4 text-slate-600">
                    <div className="flex flex-col">
                      <span>{v.phone_number}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col text-slate-600 text-sm">
                      <span>{v.sector}, {v.district}, {v.province}</span>
                      {(v.cell || v.village) && <span className="text-xs text-slate-400">{v.village} - {v.cell}</span>}
                    </div>
                  </td>
                  {user?.stock?.is_endpoint && (
                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(v)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              </tbody>
            </table>
            <Pagination {...pagination} onPageChange={pagination.jump} />
          </>
        )}
      </div>

      {showModal && user?.stock?.is_endpoint && (
        <div className="fixed inset-0 bg-slate-900/20 z-50 overflow-y-auto transition-opacity" onClick={closeModal}>
          <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
            <div className="bg-white rounded-sm w-full max-w-[1100px] my-4 sm:my-8 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>

              <div className="px-6 pt-6 pb-4 shrink-0 relative">
                <h2 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{editingId ? 'Edit Veterinary' : 'Add New Veterinary'}</h2>
                <p className="text-[15px] text-slate-500 mt-1">{editingId ? 'Update veterinary personnel details' : 'Register a new veterinary personnel'}</p>

                <button
                  onClick={closeModal}
                  className="absolute top-10 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                  <div className="space-y-8">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Veterinary Name *</label>
                      <input
                        type="text" required
                        placeholder="e.g. Dr. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>



                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Phone Number *</label>
                      <div className="flex items-center">
                        <span className="text-slate-900 font-medium mr-2 text-[17px] border-b border-slate-200 pb-2">RW +250</span>
                        <input
                          type="text" required
                          placeholder="788 000 000"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value.replace(/\D/g, '') })}
                          className="flex-1 px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                    </div>



                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Province *</label>
                      <input
                        type="text" required
                        placeholder="Province"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">District *</label>
                      <input
                        type="text" required
                        placeholder="District"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Sector *</label>
                      <input
                        type="text" required
                        placeholder="Sector"
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Cell</label>
                      <input
                        type="text"
                        placeholder="Cell"
                        value={formData.cell}
                        onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Village</label>
                      <input
                        type="text"
                        placeholder="Village"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full px-0 pb-2 border-b border-slate-200 bg-transparent outline-none focus:border-blue-500 transition-colors text-[17px] text-slate-900 font-medium placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end gap-6 items-center">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-[13px] font-bold text-slate-500 hover:text-slate-800 tracking-wider transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] tracking-wider rounded transition-colors disabled:opacity-50"
                    >
                      {saveMutation.isPending ? 'SAVING...' : (editingId ? 'UPDATE RECORD' : 'SAVE RECORD')}
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


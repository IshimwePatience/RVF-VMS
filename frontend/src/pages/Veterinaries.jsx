import React, { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronDown, Pencil, Trash2, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Dropdown from '../components/Dropdown';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Veterinaries() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters for Admin
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

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

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ 
      name: '', email: '', phone_number: '', national_id: '', 
      province: user?.stock?.province || '', 
      district: user?.stock?.district || '', 
      sector: user?.stock?.sector || '', 
      cell: '', village: '' 
    });
    setShowModal(true);
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

  const filteredVeterinaries = useMemo(() => {
    return veterinaries.filter(v => {
      if (search) {
        const searchVal = search.toLowerCase();
        if (!JSON.stringify(v).toLowerCase().includes(searchVal)) return false;
      }
      return true;
    });
  }, [veterinaries, search]);

  const pagination = usePagination(filteredVeterinaries, 12);

  // Update URL search params when search changes
  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Veterinaries</h1>
          <p className="text-slate-500 mt-1">Manage veterinary personnel in your jurisdiction</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search veterinaries..." 
              value={search} 
              onChange={(e) => handleSearchChange(e.target.value)} 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>
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
              onClick={handleAdd}
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Veterinary' : 'Add New Veterinary'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text" required
                    placeholder="e.g. John Doe"
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

                {user?.stock?.district && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={user.stock.district}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none text-sm"
                    />
                  </div>
                )}
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


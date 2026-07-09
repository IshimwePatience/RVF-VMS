import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';
import minisanteLogo from '../../assets/images/MINISANTE.png';

export default function HomeVaccinationTab({ phone, onSubmissionComplete }) {
  const queryClient = useQueryClient();
  const { addToast } = useContext(ToastContext);
  const [expandedAnimals, setExpandedAnimals] = useState({});

  const [homes, setHomes] = useState(() => {
    const saved = localStorage.getItem('rvf_vaccination_form_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: Date.now(),
        owner_name: '',
        owner_phone: '',
        owner_national_id: '',
        animals: [
          { id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rvf_vaccination_form_draft', JSON.stringify(homes));
  }, [homes]);

  const { data: availableVaccines = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['available-vaccines', phone],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/available-vaccines?phone=${encodeURIComponent(phone)}`);
      return res.data;
    },
    enabled: !!phone
  });

  if (queryError) {
    addToast('Failed to fetch available vaccines.', 'error');
  }

  const addHome = () => {
    setHomes([
      ...homes,
      {
        id: Date.now(),
        owner_name: '',
        owner_phone: '',
        owner_national_id: '',
        animals: [
          { id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }
        ]
      }
    ]);
  };

  const removeHome = (homeId) => {
    if (homes.length === 1) return;
    setHomes(homes.filter(h => h.id !== homeId));
  };

  const updateHome = (homeId, field, value) => {
    setHomes(homes.map(h => h.id === homeId ? { ...h, [field]: value } : h));
  };

  const addAnimal = (homeId) => {
    setHomes(homes.map(h => {
      if (h.id === homeId) {
        return {
          ...h,
          animals: [...h.animals, { id: Date.now(), animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }]
        };
      }
      return h;
    }));
  };

  const removeAnimal = (homeId, animalId) => {
    setHomes(homes.map(h => {
      if (h.id === homeId) {
        if (h.animals.length === 1) return h;
        return { ...h, animals: h.animals.filter(a => a.id !== animalId) };
      }
      return h;
    }));
  };

  const updateAnimal = (homeId, animalId, field, value) => {
    setHomes(homes.map(h => {
      if (h.id === homeId) {
        return {
          ...h,
          animals: h.animals.map(a => a.id === animalId ? { ...a, [field]: value } : a)
        };
      }
      return h;
    }));
  };

  const submitMutation = useMutation({
    mutationFn: async (promises) => Promise.all(promises),
    onSuccess: () => {
      setHomes([{
        id: Date.now(),
        owner_name: '', owner_phone: '', owner_national_id: '',
        animals: [{ id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }]
      }]);
      addToast('Vaccination records submitted successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onSubmissionComplete) onSubmissionComplete();
      queryClient.invalidateQueries({ queryKey: ['overview-stats'] });
    },
    onError: (err) => {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to submit records.', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const promises = homes.map(home => {
        const formattedAnimals = [];
        home.animals.forEach(a => {
          const selections = Array.isArray(a.vaccine_selection) ? a.vaccine_selection : [a.vaccine_selection].filter(Boolean);
          selections.forEach(sel => {
            const selectedVaccine = availableVaccines.find(v => v.display_name === sel);
            formattedAnimals.push({
              animal_type: a.animal_type,
              animal_identification: 'N/A',
              vaccine_name: selectedVaccine ? selectedVaccine.vaccine_name : '',
              batch_number: selectedVaccine ? selectedVaccine.batch_number : '',
              dose_given: parseInt(a.dose_given) || 0,
              damages: parseInt(a.damages) || 0,
            });
          });
        });

        return axios.post('/rvf-api/veterinary-portal/vaccination', {
          phone,
          owner_name: home.owner_name,
          owner_phone: home.owner_phone,
          owner_national_id: home.owner_national_id,
          home_identifier: home.id.toString(),
          animals: formattedAnimals
        });
      });

      submitMutation.mutate(promises);
    } catch (err) {
      console.error(err);
      addToast('Failed to build records payload.', 'error');
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center text-slate-500">Loading form...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-3 bg-blue-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <img src={minisanteLogo} alt="MINISANTE" className="h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-normal text-[#202124] mb-3">Record Home Vaccinations</h1>
          <p className="text-sm text-slate-600">
            Please fill out this form to record vaccinations administered during your home visits.
            You can add multiple homes and multiple animals per home before submitting.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {homes.map((home, homeIndex) => (
          <div key={home.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="h-2 bg-blue-400"></div>
            
            {homes.length > 1 && (
              <button
                type="button"
                onClick={() => removeHome(home.id)}
                className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove this home"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-normal text-[#202124] mb-6">Home #{homeIndex + 1} Information</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[15px] font-medium text-[#202124] mb-4">
                      Owner's Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" required
                      value={home.owner_name}
                      onChange={e => updateHome(home.id, 'owner_name', e.target.value)}
                      placeholder="Your answer"
                      className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-medium text-[#202124] mb-4">
                      Owner's Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" required
                      minLength="10" maxLength="10"
                      pattern="^250\d{7}$"
                      title="Must start with 250 and be exactly 10 digits"
                      value={home.owner_phone}
                      onChange={e => updateHome(home.id, 'owner_phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="Your answer"
                      className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-medium text-[#202124] mb-4">
                      Owner's National ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" required
                      minLength="16" maxLength="16"
                      pattern="^\d{16}$"
                      title="National ID must be exactly 16 digits"
                      value={home.owner_national_id}
                      onChange={e => updateHome(home.id, 'owner_national_id', e.target.value.replace(/\D/g, ''))}
                      placeholder="Your answer"
                      className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8 mt-8">
                <h3 className="text-2xl font-normal text-[#202124] mb-6">Domestic Animals at this Home</h3>

                <div className="space-y-8">
                  {home.animals.map((animal, index) => (
                    <div key={animal.id} className="py-6 border-b border-slate-100 last:border-0 relative group">
                      {home.animals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAnimal(home.id, animal.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove Animal"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-[15px] font-medium text-[#202124] mb-4">Animal Type <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={animal.animal_type}
                            onChange={e => updateAnimal(home.id, animal.id, 'animal_type', e.target.value)}
                            className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px] bg-transparent"
                          >
                            <option value="" disabled>Choose</option>
                            <option value="Sheep">Sheep</option>
                            <option value="Goat">Goat</option>
                            <option value="Cattle">Cattle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[15px] font-medium text-[#202124] mb-4">Vaccines <span className="text-red-500">*</span></label>
                          <div className="space-y-3">
                            {(expandedAnimals[animal.id] ? availableVaccines : availableVaccines.slice(0, 5)).map(v => (
                              <label key={v.display_name} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={v.display_name}
                                  checked={Array.isArray(animal.vaccine_selection) && animal.vaccine_selection.includes(v.display_name)}
                                  onChange={e => {
                                    const currentSelection = Array.isArray(animal.vaccine_selection) ? animal.vaccine_selection : [];
                                    if (e.target.checked) {
                                      updateAnimal(home.id, animal.id, 'vaccine_selection', [...currentSelection, v.display_name]);
                                    } else {
                                      updateAnimal(home.id, animal.id, 'vaccine_selection', currentSelection.filter(name => name !== v.display_name));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600 cursor-pointer"
                                />
                                <span className="text-[15px] text-[#202124]">{v.display_name}</span>
                              </label>
                            ))}
                            {availableVaccines.length > 5 && (
                              <button
                                type="button"
                                onClick={() => setExpandedAnimals(prev => ({ ...prev, [animal.id]: !prev[animal.id] }))}
                                className="text-blue-600 font-medium text-[14px] hover:underline mt-2 block"
                              >
                                {expandedAnimals[animal.id] ? 'See less' : 'See more'}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[15px] font-medium text-[#202124] mb-4">Dose Given <span className="text-red-500">*</span></label>
                          <input
                            type="number" required min="1"
                            value={animal.dose_given}
                            onChange={e => updateAnimal(home.id, animal.id, 'dose_given', e.target.value)}
                            className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px] bg-transparent"
                            placeholder="Your answer"
                          />
                        </div>
                        <div>
                          <label className="block text-[15px] font-medium text-[#202124] mb-4">Damaged Dose</label>
                          <input
                            type="number" min="0"
                            value={animal.damages}
                            onChange={e => updateAnimal(home.id, animal.id, 'damages', e.target.value)}
                            className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px] bg-transparent"
                            placeholder="Your answer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addAnimal(home.id)}
                    className="mt-4 flex items-center gap-1 text-[14px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add another animal to this home
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={addHome}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Home
          </button>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setHomes([{
                  id: Date.now(),
                  owner_name: '', owner_phone: '', owner_national_id: '',
                  animals: [{ id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }]
                }]);
              }}
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-[14px] font-medium transition-colors"
            >
              Clear form
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded text-[15px] font-medium transition-colors disabled:opacity-70"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

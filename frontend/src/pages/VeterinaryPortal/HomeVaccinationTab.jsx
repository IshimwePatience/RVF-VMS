import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import minisanteLogo from '../../assets/images/MINISANTE.png';

export default function HomeVaccinationTab({ email, onSubmissionComplete }) {
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expandedAnimals, setExpandedAnimals] = useState({});

  const [homes, setHomes] = useState([
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

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/veterinary-portal/available-vaccines?email=${encodeURIComponent(email)}`);
        setAvailableVaccines(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch available vaccines.');
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchVaccines();
  }, [email]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // We will send each animal as a separate record, including its home info
      let allAnimals = [];
      
      for (const home of homes) {
        for (const animal of home.animals) {
          const selectedVaccine = availableVaccines.find(v => v.display_name === animal.vaccine_selection);
          allAnimals.push({
            owner_name: home.owner_name,
            owner_phone: home.owner_phone,
            owner_national_id: home.owner_national_id,
            animal_type: animal.animal_type,
            vaccine_name: selectedVaccine ? selectedVaccine.vaccine_name : '',
            batch_number: selectedVaccine ? selectedVaccine.batch_number : '',
            dose_given: parseInt(animal.dose_given) || 0,
            damages: parseInt(animal.damages) || 0,
          });
        }
      }

      // Instead of the previous payload where there was 1 home and N animals, 
      // the backend controller we wrote expects: { email, owner_name, owner_phone, owner_national_id, home_identifier, animals: [...] }
      // Wait, our backend controller assumes ONE home per payload! 
      // Let's modify the backend controller to just accept an array of fully populated records if we want to submit multiple homes at once.
      // Or we can just fire multiple requests, one per home. Let's do one request per home to be safe without changing backend right now.
      
      const promises = homes.map(home => {
        const formattedAnimals = [];
        home.animals.forEach(a => {
          const selections = Array.isArray(a.vaccine_selection) ? a.vaccine_selection : [a.vaccine_selection].filter(Boolean);
          selections.forEach(sel => {
            const selectedVaccine = availableVaccines.find(v => v.display_name === sel);
            formattedAnimals.push({
              animal_type: a.animal_type,
              vaccine_name: selectedVaccine ? selectedVaccine.vaccine_name : '',
              batch_number: selectedVaccine ? selectedVaccine.batch_number : '',
              dose_given: parseInt(a.dose_given) || 0,
              damages: parseInt(a.damages) || 0,
            });
          });
        });

        return axios.post('http://localhost:3001/api/veterinary-portal/vaccination', {
          email,
          owner_name: home.owner_name,
          owner_phone: home.owner_phone,
          owner_national_id: home.owner_national_id,
          animals: formattedAnimals
        });
      });

      await Promise.all(promises);
      
      // Clear form
      setHomes([{
        id: Date.now(),
        owner_name: '', owner_phone: '', owner_national_id: '',
        animals: [{ id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }]
      }]);
      
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onSubmissionComplete) onSubmissionComplete();
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit records.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center text-slate-500">Loading form...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {success && (
        <div className="bg-green-50 text-green-800 rounded-xl p-6 border border-green-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Vaccination Records Submitted!</h3>
          <p className="text-sm">Thank you for submitting the vaccination records. The overview has been updated.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 rounded-xl p-6 border border-red-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Error Submitting Records</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

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
                      type="text" required
                      value={home.owner_phone}
                      onChange={e => updateHome(home.id, 'owner_phone', e.target.value)}
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
                      value={home.owner_national_id}
                      onChange={e => updateHome(home.id, 'owner_national_id', e.target.value)}
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
                          <input
                            type="text" required
                            value={animal.animal_type}
                            onChange={e => updateAnimal(home.id, animal.id, 'animal_type', e.target.value)}
                            className="w-full outline-none border-b border-slate-300 focus:border-blue-600 focus:border-b-2 transition-all pb-1 text-[15px] bg-transparent"
                            placeholder="Your answer"
                          />
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
                setSuccess(false);
                setError(null);
              }}
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-[14px] font-medium transition-colors"
            >
              Clear form
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded text-[15px] font-medium transition-colors disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

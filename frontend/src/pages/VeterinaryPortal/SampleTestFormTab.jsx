import React, { useState } from 'react';
import axios from 'axios';
import LocationDropdown from '../../components/LocationDropdown';
import minisanteLogo from '../../assets/images/MINISANTE.png';

const RWANDA_DISTRICTS = [
  "Bugesera", "Burera", "Gakenke", "Gasabo", "Gatsibo", "Gicumbi", "Gisagara",
  "Huye", "Kamonyi", "Karongi", "Kayonza", "Kicukiro", "Kirehe", "Muhanga",
  "Musanze", "Ngoma", "Ngororero", "Nyabihu", "Nyagatare", "Nyamagabe",
  "Nyamasheke", "Nyanza", "Nyarugenge", "Nyaruguru", "Rubavu", "Ruhango",
  "Rulindo", "Rusizi", "Rutsiro", "Rwamagana"
];

export default function SampleTestFormTab({ email }) {
  const [headerData, setHeaderData] = useState({
    district: '',
    fromAbattoir: '',
    samplesType: '',
    abattoirDetails: '',
    collectionDate: '',
    testRequested: '',
    submittedBy: '',
    phoneNumber: ''
  });

  const getEmptyRows = () => Array.from({ length: 10 }, (_, i) => ({
    sn: i + 1,
    farmer_name: '',
    phone: '',
    district_origin: '',
    sector: '',
    cell: '',
    village: '',
    specie: '',
    animal_id: '',
    breed: '',
    sex: '',
    age: '',
    vaccination_status: '',
    purpose: '',
    health_status: ''
  }));

  const [rows, setRows] = useState(getEmptyRows());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleHeaderChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (index, field, value) => {
    if (isRowDisabled(index)) {
      setError(`Please fill in the previous row before starting Sample #${rows[index].sn}.`);
      return;
    }
    if (error && error.includes('previous row before starting Sample')) {
      setError(null);
    }
    const newRows = [...rows];
    newRows[index][field] = value;
    
    if (field === 'district_origin') {
      newRows[index].sector = '';
      newRows[index].cell = '';
      newRows[index].village = '';
    } else if (field === 'sector') {
      newRows[index].cell = '';
      newRows[index].village = '';
    } else if (field === 'cell') {
      newRows[index].village = '';
    }

    setRows(newRows);
  };

    const isRowDisabled = (index) => {
    if (index === 0) return false;
    const prevRow = rows[index - 1];
    return !Object.entries(prevRow).some(([key, value]) => key !== 'sn' && value?.toString().trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const filledRows = rows.filter(row => {
      return Object.entries(row).some(([key, value]) => key !== 'sn' && value.toString().trim() !== '');
    });

    if (filledRows.length === 0) {
      setError('Please fill in at least one sample row.');
      setLoading(false);
      return;
    }

    const requiredRowFields = [
      'farmer_name', 'phone', 'district_origin', 'sector', 'cell', 'village',
      'specie', 'animal_id', 'breed', 'sex', 'age', 'vaccination_status',
      'purpose', 'health_status'
    ];

    for (let i = 0; i < filledRows.length; i++) {
      const row = filledRows[i];
      for (const field of requiredRowFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          setError(`Please complete all fields for Sample #${row.sn}. Row must be fully filled.`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const payload = {
        veterinary_email: email,
        district: headerData.district,
        from_abattoir: headerData.fromAbattoir,
        samples_type: headerData.samplesType,
        abattoir_details: headerData.abattoirDetails,
        collection_date: headerData.collectionDate,
        test_requested: headerData.testRequested,
        submitted_by: headerData.submittedBy,
        phone_number: headerData.phoneNumber,
        samples: filledRows
      };

      await axios.post('/rvf-api/surveillance', payload);
      setSuccess(true);
      setHeaderData({
        district: '', fromAbattoir: '', samplesType: '', abattoirDetails: '',
        collectionDate: '', testRequested: '', submittedBy: '', phoneNumber: ''
      });
      setRows(getEmptyRows());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Failed to submit surveillance form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 p-4 sm:p-8 rounded-lg shadow-sm border border-slate-200">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-1">Form submitted successfully!</h3>
          <p className="text-sm">The surveillance sampling form has been saved.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          {error}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-0">
        <div className="w-full md:w-32 flex justify-center md:justify-start">
          <img src={`${import.meta.env.BASE_URL}RAB_Logo2.png`} alt="RAB" className="h-16 object-contain" />
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold tracking-wide underline underline-offset-4 decoration-2 text-center flex-1">
          SURVEILLANCE SAMPLING FORM
        </h1>
        
        <div className="w-full md:w-32 flex justify-center md:justify-end">
          <img src={minisanteLogo} alt="MINISANTE" className="h-16 object-contain" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 text-[15px] bg-slate-50 p-6 rounded-xl border border-slate-200">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">District:</label>
              <select required value={headerData.district} onChange={(e) => handleHeaderChange('district', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600 appearance-none cursor-pointer">
                <option value="">Select District</option>
                {RWANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">Numbers & Type of Samples:</label>
              <input type="text" value={headerData.samplesType} onChange={(e) => handleHeaderChange('samplesType', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">Date of Sample Collection:</label>
              <input type="date" value={headerData.collectionDate} onChange={(e) => handleHeaderChange('collectionDate', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap text-blue-700">Submitted by (Name & Title):</label>
              <input type="text" required value={headerData.submittedBy} onChange={(e) => handleHeaderChange('submittedBy', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-blue-400 outline-none pb-1 focus:border-blue-600" placeholder="e.g. John Doe, Veterinarian" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">Sample Source:</label>
              <select value={headerData.fromAbattoir} onChange={(e) => handleHeaderChange('fromAbattoir', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600 appearance-none cursor-pointer">
                <option value=""></option>
                <option value="Home">Home</option>
                <option value="Market">Market</option>
                <option value="Abattoir">Abattoir</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">If Market/Abattoir (Name & Phone):</label>
              <input type="text" value={headerData.abattoirDetails} onChange={(e) => handleHeaderChange('abattoirDetails', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">Test Requested:</label>
              <input type="text" value={headerData.testRequested} onChange={(e) => handleHeaderChange('testRequested', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-slate-400 outline-none pb-1 focus:border-blue-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap text-blue-700">Phone Number:</label>
              <input type="tel" required pattern="^\d{10}$" title="Must be exactly 10 digits" value={headerData.phoneNumber} onChange={(e) => handleHeaderChange('phoneNumber', e.target.value.replace(/\D/g, ''))} className="flex-1 bg-transparent border-b border-dotted border-blue-400 outline-none pb-1 focus:border-blue-600" />
            </div>
          </div>
        </div>

        {/* Mobile View: Stacked Cards (Hidden on md and up) */}
        <div className="md:hidden space-y-8 mt-6">
          <h2 className="font-bold text-lg border-b pb-2">Sample Records</h2>
          {rows.map((row, index) => (
            <div key={index} className="bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
              <div className="font-bold text-lg text-blue-800 border-b border-slate-200 pb-2 mb-4">Sample #{row.sn}</div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Farmer Name</label>
                  <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={row.farmer_name} onChange={(e) => handleRowChange(index, 'farmer_name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input type="tel" pattern="^\d{10}$" title="Must be exactly 10 digits" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={row.phone} onChange={(e) => handleRowChange(index, 'phone', e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Animal District Origin</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={row.district_origin} onChange={(e) => handleRowChange(index, 'district_origin', e.target.value)}>
                    <option value="">Select District</option>
                    {RWANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sector</label>
                    <LocationDropdown
                      type="sectors"
                      params={{ district: row.district_origin }}
                      value={row.sector}
                      onChange={(val) => handleRowChange(index, 'sector', val)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 appearance-none"
                      placeholder="Select Sector"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Cell</label>
                    <LocationDropdown
                      type="cells"
                      params={{ district: row.district_origin, sector: row.sector }}
                      value={row.cell}
                      onChange={(val) => handleRowChange(index, 'cell', val)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 appearance-none"
                      placeholder="Select Cell"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Village</label>
                    <LocationDropdown
                      type="villages"
                      params={{ district: row.district_origin, sector: row.sector, cell: row.cell }}
                      value={row.village}
                      onChange={(val) => handleRowChange(index, 'village', val)}
                      className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 appearance-none"
                      placeholder="Select Village"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Specie</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.specie} onChange={(e) => handleRowChange(index, 'specie', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 flex items-center justify-between">Animal Id</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" placeholder="Eartag or Name" value={row.animal_id} onChange={(e) => handleRowChange(index, 'animal_id', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Breed</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.breed} onChange={(e) => handleRowChange(index, 'breed', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sex</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.sex} onChange={(e) => handleRowChange(index, 'sex', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Age</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.age} onChange={(e) => handleRowChange(index, 'age', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Vaccination Status (Yes, No)</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={row.vaccination_status} onChange={(e) => handleRowChange(index, 'vaccination_status', e.target.value)}>
                    <option value=""></option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Purpose (Diagnosis, Surveillance)</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={row.purpose} onChange={(e) => handleRowChange(index, 'purpose', e.target.value)}>
                    <option value=""></option>
                    <option value="Diagnosis">Diagnosis</option>
                    <option value="Surveillance">Surveillance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Health Status (Sick, Normal, Control)</label>
                  <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.health_status} onChange={(e) => handleRowChange(index, 'health_status', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table (Hidden on sm) */}
        <div className="hidden md:block w-full mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-[12px] text-center bg-white shadow-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 p-2 font-bold w-12 text-slate-800">S/N</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[120px] text-slate-800">Farmer Name</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[100px] text-slate-800">Phone</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[100px] text-slate-800">Animal District Origin</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[90px] text-slate-800">Sector</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[90px] text-slate-800">Cell</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[90px] text-slate-800">Village</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[80px] text-slate-800">Specie</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[120px] text-slate-800">Animal Id<br/>(Eartag, Animal<br/>Name Or S/N)</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[80px] text-slate-800">Breed</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[60px] text-slate-800">Sex</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[60px] text-slate-800">Age</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[90px] text-slate-800">Vaccination<br/>Status (Yes, No)</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[100px] text-slate-800">Purpose<br/>(Diagnosis,<br/>Surveillance)</th>
                <th className="border border-slate-300 p-2 font-bold min-w-[90px] text-slate-800">Health Status<br/>(Sick, Normal,<br/>Control)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="border border-slate-300 p-1 font-bold text-slate-600 bg-slate-50">{row.sn}</td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.farmer_name} onChange={(e) => handleRowChange(index, 'farmer_name', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="tel" pattern="^\d{10}$" title="Must be exactly 10 digits" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.phone} onChange={(e) => handleRowChange(index, 'phone', e.target.value.replace(/\D/g, ''))} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <select className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30" value={row.district_origin} onChange={(e) => handleRowChange(index, 'district_origin', e.target.value)}>
                      <option value=""></option>
                      {RWANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="border border-slate-300 p-0">
                    <LocationDropdown
                      type="sectors"
                      params={{ district: row.district_origin }}
                      value={row.sector}
                      onChange={(val) => handleRowChange(index, 'sector', val)}
                      className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30"
                      placeholder="Sector"
                    />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <LocationDropdown
                      type="cells"
                      params={{ district: row.district_origin, sector: row.sector }}
                      value={row.cell}
                      onChange={(val) => handleRowChange(index, 'cell', val)}
                      className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30"
                      placeholder="Cell"
                    />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <LocationDropdown
                      type="villages"
                      params={{ district: row.district_origin, sector: row.sector, cell: row.cell }}
                      value={row.village}
                      onChange={(val) => handleRowChange(index, 'village', val)}
                      className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30"
                      placeholder="Village"
                    />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.specie} onChange={(e) => handleRowChange(index, 'specie', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.animal_id} onChange={(e) => handleRowChange(index, 'animal_id', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.breed} onChange={(e) => handleRowChange(index, 'breed', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.sex} onChange={(e) => handleRowChange(index, 'sex', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.age} onChange={(e) => handleRowChange(index, 'age', e.target.value)} />
                  </td>
                  <td className="border border-slate-300 p-0">
                    <select className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30" value={row.vaccination_status} onChange={(e) => handleRowChange(index, 'vaccination_status', e.target.value)}>
                      <option value=""></option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="border border-slate-300 p-0">
                    <select className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer focus:bg-blue-50/30" value={row.purpose} onChange={(e) => handleRowChange(index, 'purpose', e.target.value)}>
                      <option value=""></option>
                      <option value="Diagnosis">Diagnosis</option>
                      <option value="Surveillance">Surveillance</option>
                    </select>
                  </td>
                  <td className="border border-slate-300 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.health_status} onChange={(e) => handleRowChange(index, 'health_status', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end w-full">
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg shadow-md transition-colors disabled:opacity-50 text-lg">
            {loading ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}

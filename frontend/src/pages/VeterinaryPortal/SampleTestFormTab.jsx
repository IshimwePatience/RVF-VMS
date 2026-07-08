import React, { useState } from 'react';
import axios from 'axios';

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
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

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
        samples: rows
      };

      await axios.post('/rvf-api/surveillance', payload);
      setSuccess(true);
      setHeaderData({
        district: '', fromAbattoir: '', samplesType: '', abattoirDetails: '',
        collectionDate: '', testRequested: '', submittedBy: '', phoneNumber: ''
      });
      setRows(getEmptyRows());
    } catch (err) {
      console.error(err);
      setError('Failed to submit surveillance form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-8 rounded-lg shadow-xl overflow-x-auto border border-slate-700 min-w-max">
      {success && (
        <div className="bg-green-50/10 border border-green-500 text-green-400 p-4 rounded mb-6">
          Form submitted successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50/10 border border-red-500 text-red-400 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-2">
          <div className="text-black font-bold text-center text-sm leading-tight">
            RAB<br/><span className="text-[10px]">RWANDA AGRICULTURE BOARD</span>
          </div>
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold tracking-wider underline underline-offset-4 decoration-2">
          SURVEILLANCE SAMPLING FORM
        </h1>
        
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-2">
          <div className="w-16 h-16 rounded-full border-2 border-blue-800 bg-blue-50 flex items-center justify-center">
            <span className="text-blue-800 font-bold text-xs">GOV</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 text-[15px]">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">District:</label>
              <select required value={headerData.district} onChange={(e) => handleHeaderChange('district', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none text-white pb-1 focus:border-white appearance-none cursor-pointer">
                <option value="" className="text-black">Select District</option>
                <option value="Gasabo" className="text-black">Gasabo</option>
                <option value="Kicukiro" className="text-black">Kicukiro</option>
                <option value="Nyarugenge" className="text-black">Nyarugenge</option>
                <option value="Bugesera" className="text-black">Bugesera</option>
                <option value="Nyagatare" className="text-black">Nyagatare</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">Numbers & Type of Samples:</label>
              <input type="text" value={headerData.samplesType} onChange={(e) => handleHeaderChange('samplesType', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none pb-1 focus:border-white" />
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">Date of Sample Collection:</label>
              <input type="date" value={headerData.collectionDate} onChange={(e) => handleHeaderChange('collectionDate', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none pb-1 focus:border-white [&::-webkit-calendar-picker-indicator]:invert" />
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap text-blue-300">Submitted by (Name & Title):</label>
              <input type="text" required value={headerData.submittedBy} onChange={(e) => handleHeaderChange('submittedBy', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-blue-300 outline-none pb-1 focus:border-blue-200" placeholder="e.g. John Doe, Veterinarian" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">From Abattoir (Yes, No):</label>
              <input type="text" value={headerData.fromAbattoir} onChange={(e) => handleHeaderChange('fromAbattoir', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none pb-1 focus:border-white" />
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">If yes, Abattoir (Name & Phone):</label>
              <input type="text" value={headerData.abattoirDetails} onChange={(e) => handleHeaderChange('abattoirDetails', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none pb-1 focus:border-white" />
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap">Test Requested:</label>
              <input type="text" value={headerData.testRequested} onChange={(e) => handleHeaderChange('testRequested', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-white/60 outline-none pb-1 focus:border-white" />
            </div>
            <div className="flex items-end">
              <label className="font-bold mr-2 whitespace-nowrap text-blue-300">Phone Number:</label>
              <input type="tel" required value={headerData.phoneNumber} onChange={(e) => handleHeaderChange('phoneNumber', e.target.value)} className="flex-1 bg-transparent border-b border-dotted border-blue-300 outline-none pb-1 focus:border-blue-200" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full mt-4">
          <table className="w-full border-collapse border border-white/60 text-[12px] text-center">
            <thead>
              <tr>
                <th className="border border-white/60 p-2 font-bold w-12">S/N</th>
                <th className="border border-white/60 p-2 font-bold min-w-[120px]">Farmer Name</th>
                <th className="border border-white/60 p-2 font-bold min-w-[100px]">Phone</th>
                <th className="border border-white/60 p-2 font-bold min-w-[100px]">Animal District Origin</th>
                <th className="border border-white/60 p-2 font-bold min-w-[90px]">Sector</th>
                <th className="border border-white/60 p-2 font-bold min-w-[90px]">Cell</th>
                <th className="border border-white/60 p-2 font-bold min-w-[90px]">Village</th>
                <th className="border border-white/60 p-2 font-bold min-w-[80px]">Specie</th>
                <th className="border border-white/60 p-2 font-bold min-w-[120px]">Animal Id<br/>(Eartag, Animal<br/>Name Or S/N)</th>
                <th className="border border-white/60 p-2 font-bold min-w-[80px]">Breed</th>
                <th className="border border-white/60 p-2 font-bold min-w-[60px]">Sex</th>
                <th className="border border-white/60 p-2 font-bold min-w-[60px]">Age</th>
                <th className="border border-white/60 p-2 font-bold min-w-[90px]">Vaccination<br/>Status (Yes, No)</th>
                <th className="border border-white/60 p-2 font-bold min-w-[100px]">Purpose<br/>(Surveillance,<br/>Slaughter)</th>
                <th className="border border-white/60 p-2 font-bold min-w-[90px]">Health Status<br/>(Sick, Normal,<br/>Control)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="border border-white/60 p-1 font-bold">{row.sn}</td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.farmer_name} onChange={(e) => handleRowChange(index, 'farmer_name', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.phone} onChange={(e) => handleRowChange(index, 'phone', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <select className="w-full h-full bg-transparent outline-none p-2 text-center appearance-none cursor-pointer text-white [&>option]:text-black" value={row.district_origin} onChange={(e) => handleRowChange(index, 'district_origin', e.target.value)}>
                      <option value=""></option>
                      <option value="Gasabo">Gasabo</option>
                      <option value="Kicukiro">Kicukiro</option>
                      <option value="Nyarugenge">Nyarugenge</option>
                      <option value="Bugesera">Bugesera</option>
                      <option value="Nyagatare">Nyagatare</option>
                    </select>
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.sector} onChange={(e) => handleRowChange(index, 'sector', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.cell} onChange={(e) => handleRowChange(index, 'cell', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.village} onChange={(e) => handleRowChange(index, 'village', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.specie} onChange={(e) => handleRowChange(index, 'specie', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.animal_id} onChange={(e) => handleRowChange(index, 'animal_id', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.breed} onChange={(e) => handleRowChange(index, 'breed', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.sex} onChange={(e) => handleRowChange(index, 'sex', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.age} onChange={(e) => handleRowChange(index, 'age', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.vaccination_status} onChange={(e) => handleRowChange(index, 'vaccination_status', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.purpose} onChange={(e) => handleRowChange(index, 'purpose', e.target.value)} />
                  </td>
                  <td className="border border-white/60 p-0">
                    <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center" value={row.health_status} onChange={(e) => handleRowChange(index, 'health_status', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded shadow transition-colors disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}

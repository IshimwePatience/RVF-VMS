import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';
import LocationDropdown from '../../components/LocationDropdown';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function SprayingFormTab({ phone }) {
  const [headerData, setHeaderData] = useState(() => {
    const saved = localStorage.getItem('rvf_spraying_form_header_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      district: '',
      sector: ''
    };
  });

  const getEmptyRows = (startSn = 1) => Array.from({ length: 10 }, (_, i) => ({
    sn: startSn + i,
    itariki: '',
    amatungo_yose: '',
    izina_ryumuti: '',
    ingano_yose_yemewe: '',
    ingano_ihari: '',
    umuti_wakoreshejwe: '',
    umuti_usigaye: '',
    ubwoko_bwamatungo: '',
    umubare_wafuherewe: ''
  }));

  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('rvf_spraying_form_rows_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getEmptyRows(1);
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    localStorage.setItem('rvf_spraying_form_header_draft', JSON.stringify(headerData));
  }, [headerData]);

  useEffect(() => {
    localStorage.setItem('rvf_spraying_form_rows_draft', JSON.stringify(rows));
  }, [rows]);

  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const handleHeaderChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (index, field, value) => {
    if (isRowDisabled(index)) {
      addToast(`Please fill in the previous row before starting Row #${rows[index].sn}.`, 'error');
      return;
    }
    const newRows = [...rows];
    newRows[index][field] = value;
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

    const filledRows = rows.filter(row => {
      return Object.entries(row).some(([key, value]) => key !== 'sn' && value.toString().trim() !== '');
    });

    if (filledRows.length === 0) {
      addToast('Please fill in at least one row.', 'error');
      setLoading(false);
      return;
    }

    if (!headerData.district || !headerData.sector) {
      addToast('Please select District and Sector in the header.', 'error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        veterinary_phone: phone,
        district: headerData.district,
        sector: headerData.sector,
        records: filledRows
      };

      await axios.post('/rvf-api/spraying-reports', payload);
      addToast('Form submitted successfully!', 'success');
      localStorage.removeItem('rvf_spraying_form_header_draft');
      localStorage.removeItem('rvf_spraying_form_rows_draft');
      setCurrentPage(1);
      setHeaderData({
        district: '', sector: ''
      });
      setRows(getEmptyRows());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      addToast('Failed to submit form. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 p-4 sm:p-8 rounded-lg shadow-sm border border-slate-200">
      {/* Header section - NO LOGOS */}
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide underline underline-offset-4 decoration-2">
          Raporo y'imikoreshereze y' umuti wo gufuherera amatungo
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 text-[15px]">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">District <span className="text-red-500">*</span>:</label>
              <div className="flex-1 border-b border-dotted border-slate-400 pb-1">
                <LocationDropdown type="districts" required={true} value={headerData.district} onChange={(val) => {
                  handleHeaderChange('district', val);
                  handleHeaderChange('sector', '');
                }} placeholder="Select District" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-0">
              <label className="font-bold mr-2 whitespace-nowrap">Sector <span className="text-red-500">*</span>:</label>
              <div className="flex-1 border-b border-dotted border-slate-400 pb-1">
                <LocationDropdown 
                  type="sectors" 
                  params={{ district: headerData.district }} 
                  required={true} 
                  value={headerData.sector} 
                  onChange={(val) => handleHeaderChange('sector', val)} 
                  placeholder="Select Sector" 
                  disabled={!headerData.district}
                />
              </div>
            </div>
          </div>
          {/* Right Column (Empty for balance, or could add fields if needed) */}
          <div className="space-y-6">
          </div>
        </div>

        {/* Mobile View: Stacked Cards (Hidden on md and up) */}
        <div className="md:hidden space-y-8 mt-6">
          <h2 className="font-bold text-lg border-b pb-2">Records</h2>
          {rows.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE).map((row, relativeIndex) => {
            const index = (currentPage - 1) * ROWS_PER_PAGE + relativeIndex;
            return (
              <div key={index} className="bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
                <div className="font-bold text-lg text-blue-800 border-b border-slate-200 pb-2 mb-4">Row #{row.sn}</div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Itariki</label>
                    <input type="date" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.itariki} onChange={(e) => handleRowChange(index, 'itariki', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Amatungo yose yafuhererewe</label>
                    <input type="text" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.amatungo_yose} onChange={(e) => handleRowChange(index, 'amatungo_yose', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Izina ry'umuti ufuherera (Trade name)</label>
                    <SearchableDropdown options={['KilatiX', 'Ashimethrin', 'PermaPy+']} value={row.izina_ryumuti} onChange={(val) => handleRowChange(index, 'izina_ryumuti', val)} placeholder="Select Umuti" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ingano y'umuti wose umaze kwakirwa (litiro)</label>
                    <input type="number" step="any" min="0" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.ingano_yose_yemewe} onChange={(e) => handleRowChange(index, 'ingano_yose_yemewe', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ingano y'umuti wari uhari uyu munsi mbere yo</label>
                    <input type="number" step="any" min="0" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.ingano_ihari} onChange={(e) => handleRowChange(index, 'ingano_ihari', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Umuti wakoreshejwe uyu munsi (litiro)</label>
                    <input type="number" step="any" min="0" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.umuti_wakoreshejwe} onChange={(e) => handleRowChange(index, 'umuti_wakoreshejwe', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Umuti usigaye uyu munsi (litiro)</label>
                    <input type="number" step="any" min="0" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.umuti_usigaye} onChange={(e) => handleRowChange(index, 'umuti_usigaye', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ubwoko bw'amatungo</label>
                    <SearchableDropdown options={['Inka', 'Ihene', 'Intama']} value={row.ubwoko_bwamatungo} onChange={(val) => handleRowChange(index, 'ubwoko_bwamatungo', val)} placeholder="Select Ubwoko" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Umubare wafuherewe</label>
                    <input type="number" min="0" className="w-full bg-white border border-slate-300 rounded p-2 outline-none focus:border-blue-500" value={row.umubare_wafuherewe} onChange={(e) => handleRowChange(index, 'umubare_wafuherewe', e.target.value)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table (Hidden on sm) */}
        <div className="hidden md:block w-full mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-[12px] text-center bg-white shadow-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[50px] h-full flex items-center justify-center font-bold">
                    S/N
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[120px] h-full flex items-center justify-center font-bold">
                    Itariki
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Amatungo yose<br/>yafuhererewe
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Izina ry'umuti<br/>ufuherera (Trade name)
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Ingano y'umuti<br/>wose umaze<br/>kwakirwa (litiro)
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Ingano y'umuti<br/>wari uhari uyu<br/>munsi mbere yo
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Umuti wakoreshejwe<br/>uyu munsi (litiro)
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[150px] h-full flex items-center justify-center font-bold">
                    Umuti usigaye<br/>uyu munsi (litiro)
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[130px] h-full flex items-center justify-center font-bold">
                    Ubwoko<br/>bw'amatungo
                  </div>
                </th>
                <th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">
                  <div className="resize-x overflow-auto p-2 min-w-[120px] h-full flex items-center justify-center font-bold">
                    Umubare<br/>wafuherewe
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE).map((row, relativeIndex) => {
                const index = (currentPage - 1) * ROWS_PER_PAGE + relativeIndex;
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="border border-slate-300 p-1 font-bold text-slate-600 bg-slate-50">{row.sn}</td>
                    <td className="border border-slate-300 p-0">
                      <input type="date" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.itariki} onChange={(e) => handleRowChange(index, 'itariki', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="text" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.amatungo_yose} onChange={(e) => handleRowChange(index, 'amatungo_yose', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <SearchableDropdown options={['KilatiX', 'Ashimethrin', 'PermaPy+']} value={row.izina_ryumuti} onChange={(val) => handleRowChange(index, 'izina_ryumuti', val)} placeholder="Select Umuti" />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="number" step="any" min="0" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.ingano_yose_yemewe} onChange={(e) => handleRowChange(index, 'ingano_yose_yemewe', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="number" step="any" min="0" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.ingano_ihari} onChange={(e) => handleRowChange(index, 'ingano_ihari', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="number" step="any" min="0" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.umuti_wakoreshejwe} onChange={(e) => handleRowChange(index, 'umuti_wakoreshejwe', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="number" step="any" min="0" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.umuti_usigaye} onChange={(e) => handleRowChange(index, 'umuti_usigaye', e.target.value)} />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <SearchableDropdown options={['Inka', 'Ihene', 'Intama']} value={row.ubwoko_bwamatungo} onChange={(val) => handleRowChange(index, 'ubwoko_bwamatungo', val)} placeholder="Select" />
                    </td>
                    <td className="border border-slate-300 p-0">
                      <input type="number" min="0" className="w-full h-full bg-transparent outline-none p-2 text-center focus:bg-blue-50/30" value={row.umubare_wafuherewe} onChange={(e) => handleRowChange(index, 'umubare_wafuherewe', e.target.value)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <button 
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded disabled:opacity-50 hover:bg-slate-200 transition-colors font-semibold"
          >
            Previous
          </button>
          <span className="font-bold text-slate-700">Page {currentPage}</span>
          <button 
            type="button"
            onClick={() => {
              if (currentPage * ROWS_PER_PAGE >= rows.length) {
                setRows(prev => [...prev, ...getEmptyRows(prev.length + 1)]);
              }
              setCurrentPage(p => p + 1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            Next
          </button>
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

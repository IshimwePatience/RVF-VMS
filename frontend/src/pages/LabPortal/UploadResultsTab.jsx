import React, { useState, useContext, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertTriangle, UploadCloud } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';

export default function UploadResultsTab() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testedSite, setTestedSite] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useContext(ToastContext);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    
    if (
      !selectedFile.name.endsWith('.xlsx') && 
      !selectedFile.name.endsWith('.xls') && 
      !selectedFile.name.endsWith('.csv')
    ) {
      addToast('Please upload a valid Excel or CSV file', 'error');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON using first row as header.
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        
        if (!jsonData || jsonData.length === 0) {
          addToast('File is empty or invalid format.', 'error');
          setParsedData(null);
          setRawData(null);
          return;
        }

        // Map to expected backend columns
        const processedData = jsonData.map(row => {
          // Safer key matching
          const getVal = (possibleKeys) => {
            for (const k of Object.keys(row)) {
              const cleanK = k.toLowerCase().trim();
              if (possibleKeys.some(pk => {
                const cleanPk = pk.toLowerCase().trim();
                return cleanK === cleanPk || cleanK === `${cleanPk}s` || cleanK.includes(` ${cleanPk}`) || cleanK.includes(`${cleanPk} `) || cleanK.includes(`/${cleanPk}`) || cleanK.includes(`${cleanPk}/`);
              })) {
                return row[k]?.toString() || '';
              }
            }
            return '';
          };

          return {
            farmer_name: getVal(['Farmer Name', 'Farmer']),
            phone: getVal(['Phone', 'Phone Number', 'Contact']),
            animal_district_origin: getVal(['District Origin', 'District']),
            sector: getVal(['Sector']),
            cell: getVal(['Cell']),
            village: getVal(['Village']),
            specie: getVal(['Specie', 'Species']),
            animal_id: getVal(['Animal ID', 'Eartag', 'Tag']),
            breed: getVal(['Breed']),
            sex: getVal(['Sex', 'Gender']),
            age: getVal(['Age']),
            vaccination_status: getVal(['Vaccination Status', 'Vaccination']),
            purpose: getVal(['Purpose']),
            health_status: getVal(['Health Status']),
            rvf_pcr_results: getVal(['PCR Result', 'PCR Results', 'Result']),
          };
        }).filter(r => r.animal_id || r.farmer_name); // Filter out completely empty rows

        if (processedData.length === 0) {
           addToast('Could not find recognizable data in this file. Please use the downloaded template.', 'error');
           setParsedData(null);
           setRawData(null);
           return;
        }

        setParsedData(processedData);
        
        // For raw preview: get headers and rows
        const headers = Object.keys(jsonData[0] || {});
        const previewData = [headers, ...jsonData.map(row => headers.map(h => row[h]))];
        setRawData(previewData);

      } catch (err) {
        console.error(err);
        addToast('Failed to parse Excel file', 'error');
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!parsedData || parsedData.length === 0) return;
    if (!testedSite) {
      addToast('Please select a testing location before uploading.', 'error');
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null);

    try {
      const dataToUpload = parsedData.map(item => ({ ...item, tested_site: testedSite }));
      const res = await axios.post('/rvf-api/lab-results', dataToUpload);
      setUploadResult({
        success: true,
        created: res.data.created,
        updated: res.data.updated
      });
      addToast('Results uploaded successfully', 'success');
      setFile(null);
      setParsedData(null);
      setTestedSite('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        addToast(err.response.data.message, 'error');
      } else {
        addToast('Failed to upload results to the server', 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setParsedData(null);
    setRawData(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto text-slate-800">

      {/* Upload Dropzone */}
      {!parsedData && (
        <div 
          className={`relative py-16 transition-all duration-300 flex flex-col items-center justify-center text-center
            ${isDragging ? '' : 'bg-transparent'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />

          <h2 className="text-2xl md:text-3xl leading-tight font-bold text-[#4a4a4a] tracking-tight max-w-xl mb-8">
            Upload RVF Test Results
          </h2>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-[#1b64da] text-white rounded-full font-semibold text-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            Upload Excel File
          </button>
          
          <p className="text-[#4a4a4a] mt-6 font-medium text-lg">
            or drop a file,
          </p>
          <p className="text-sm font-normal text-slate-400 mt-2">
            Supports .xlsx, .xls, .csv
          </p>
        </div>
      )}

      {/* File Preview */}
      {parsedData && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{file?.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{parsedData.length} valid records found</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6 max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
                <tbody className="divide-y divide-slate-200">
                  {rawData && rawData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-2 px-3 border-r border-slate-200 last:border-r-0 ${
                          idx < 5 || (typeof cell === 'string' && (cell.toLowerCase().includes('prepared by') || cell.toLowerCase().includes('operator'))) ? 'font-bold text-slate-900 bg-slate-100/50' : ''
                        }`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Testing Location <span className="text-red-500">*</span></span>
                <select 
                  value={testedSite === 'Other' ? 'Other' : testedSite}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setTestedSite('Other');
                    } else {
                      setTestedSite(e.target.value);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isUploading}
                >
                  <option value="">Select location</option>
                  <option value="Rubilizi-Kigali Lab">Rubilizi-Kigali Lab</option>
                  <option value="Gihundwe-Rusizi Lab">Gihundwe-Rusizi Lab</option>
                  <option value="CHUB-Huye Lab">CHUB-Huye Lab</option>
                  <option value="Rubavu-Gisenyi Lab">Rubavu-Gisenyi Lab</option>
                  <option value="Rwamagana Lab">Rwamagana Lab</option>
                  <option value="Ngoma Lab">Ngoma Lab</option>
                  <option value="Other">Other</option>
                </select>
                
                {testedSite === 'Other' || (testedSite && !['Rubilizi-Kigali Lab', 'Gihundwe-Rusizi Lab', 'CHUB-Huye Lab', 'Rubavu-Gisenyi Lab', 'Rwamagana Lab', 'Ngoma Lab'].includes(testedSite)) ? (
                  <input
                    type="text"
                    placeholder="Type location..."
                    value={testedSite === 'Other' ? '' : testedSite}
                    onChange={(e) => setTestedSite(e.target.value || 'Other')}
                    className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isUploading}
                  />
                ) : null}
              </div>

              <div className="flex justify-end gap-4 w-full sm:w-auto">
                <button 
                  onClick={clearFile}
                  className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors w-full sm:w-auto"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={isUploading || !testedSite}
                  className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5" />
                      Upload / Update Results
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
        
        // Convert to JSON. The user's screenshot has headers on row 5 (index 4).
        // Let's assume standard parsing for now, or just look for the first row with 'S/N' or 'Farmer Name'
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        
        // Find the actual data rows. The headers might not be on the first line.
        // Let's map it based on expected columns: "Farmer Name", "Animal Id", "RVF PCR Results"
        let processedData = [];
        
        let foundHeader = false;
        let keysMapping = {};
        
        // Fallback simple parsing if headers are recognized by xlsx
        const standardData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        for (let row of standardData) {
          if (!foundHeader) {
            // Check if this row looks like a header
            const rowStr = row.join(' ').toLowerCase();
            if (rowStr.includes('farmer') && rowStr.includes('results')) {
              foundHeader = true;
              row.forEach((col, idx) => {
                if (!col) return;
                const c = col.toString().toLowerCase();
                if (c.includes('farmer')) keysMapping.farmer_name = idx;
                if (c.includes('phone')) keysMapping.phone = idx;
                if (c.includes('district')) keysMapping.animal_district_origin = idx;
                if (c.includes('sector')) keysMapping.sector = idx;
                if (c.includes('cell')) keysMapping.cell = idx;
                if (c.includes('village')) keysMapping.village = idx;
                if (c.includes('specie')) keysMapping.specie = idx;
                if (c.includes('animal id') || c.includes('eartag')) keysMapping.animal_id = idx;
                if (c.includes('breed')) keysMapping.breed = idx;
                if (c.includes('sex')) keysMapping.sex = idx;
                if (c.includes('age')) keysMapping.age = idx;
                if (c.includes('vaccination')) keysMapping.vaccination_status = idx;
                if (c.includes('purpose')) keysMapping.purpose = idx;
                if (c.includes('health status')) keysMapping.health_status = idx;
                if (c.includes('pcr results') || c.includes('results')) keysMapping.rvf_pcr_results = idx;
              });
            }
          } else {
            // It's a data row
            if (row.length === 0 || !row[keysMapping.farmer_name]) continue; // Skip empty rows or summary rows
            if (row[0] && row[0].toString().toLowerCase().includes('prepared by')) break; // End of table
            
            processedData.push({
              farmer_name: row[keysMapping.farmer_name]?.toString() || '',
              phone: row[keysMapping.phone]?.toString() || '',
              animal_district_origin: row[keysMapping.animal_district_origin]?.toString() || '',
              sector: row[keysMapping.sector]?.toString() || '',
              cell: row[keysMapping.cell]?.toString() || '',
              village: row[keysMapping.village]?.toString() || '',
              specie: row[keysMapping.specie]?.toString() || '',
              animal_id: row[keysMapping.animal_id]?.toString() || '',
              breed: row[keysMapping.breed]?.toString() || '',
              sex: row[keysMapping.sex]?.toString() || '',
              age: row[keysMapping.age]?.toString() || '',
              vaccination_status: row[keysMapping.vaccination_status]?.toString() || '',
              purpose: row[keysMapping.purpose]?.toString() || '',
              health_status: row[keysMapping.health_status]?.toString() || '',
              rvf_pcr_results: row[keysMapping.rvf_pcr_results]?.toString() || '',
            });
          }
        }

        if (processedData.length === 0) {
           addToast('Could not find recognizable data in this file. Please use the standard template.', 'error');
           setParsedData(null);
           setRawData(null);
           return;
        }

        setParsedData(processedData);
        setRawData(standardData.filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== '')));

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
    setIsUploading(true);
    setUploadResult(null);

    try {
      const res = await axios.post('/rvf-api/lab-results', parsedData);
      setUploadResult({
        success: true,
        created: res.data.created,
        updated: res.data.updated
      });
      addToast('Results uploaded successfully', 'success');
      setFile(null);
      setParsedData(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to upload results to the server', 'error');
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
                          idx < 5 || (typeof cell === 'string' && cell.toLowerCase().includes('prepared by') || cell.toLowerCase().includes('operator')) ? 'font-bold text-slate-900 bg-slate-100/50' : ''
                        }`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={clearFile}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
      )}
    </div>
  );
}

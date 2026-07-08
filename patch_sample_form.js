const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/SampleTestFormTab.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useEffect to import if missing
if (!content.includes("import React, { useState, useEffect }")) {
  content = content.replace("import React, { useState }", "import React, { useState, useEffect }");
}

// 2. Add pagination state and auto-save state
const oldState = `  const [headerData, setHeaderData] = useState({
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
  const [loading, setLoading] = useState(false);`;

const newState = `  const [headerData, setHeaderData] = useState(() => {
    const saved = localStorage.getItem('rvf_sample_form_header_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      district: '',
      fromAbattoir: '',
      samplesType: '',
      abattoirDetails: '',
      collectionDate: '',
      testRequested: '',
      submittedBy: '',
      phoneNumber: ''
    };
  });

  const getEmptyRows = (startSn = 1) => Array.from({ length: 10 }, (_, i) => ({
    sn: startSn + i,
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

  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('rvf_sample_form_rows_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getEmptyRows(1);
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    localStorage.setItem('rvf_sample_form_header_draft', JSON.stringify(headerData));
  }, [headerData]);

  useEffect(() => {
    localStorage.setItem('rvf_sample_form_rows_draft', JSON.stringify(rows));
  }, [rows]);

  const [loading, setLoading] = useState(false);`;

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
}

// 3. Clear localStorage on successful submission
// Let's find onSuccess in submitMutation or the try/catch in handleSubmit
const handleSubmitSuccessOld = `setSuccess(true);
      setHeaderData({`;

const handleSubmitSuccessNew = `setSuccess(true);
      localStorage.removeItem('rvf_sample_form_header_draft');
      localStorage.removeItem('rvf_sample_form_rows_draft');
      setCurrentPage(1);
      setHeaderData({`;

if (content.includes(handleSubmitSuccessOld)) {
  content = content.replace(handleSubmitSuccessOld, handleSubmitSuccessNew);
}

// 4. Update the render methods to use slice and relative index
content = content.replace(/\{rows\.map\(\(row, index\) => \(/g, 
  `{rows.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE).map((row, relativeIndex) => {
    const index = (currentPage - 1) * ROWS_PER_PAGE + relativeIndex;
    return (`);

content = content.replace(/<\/div>\n\s*\}\)\}/g, `</div>\n          );})}`);
content = content.replace(/<\/tr>\n\s*\}\)\}/g, `</tr>\n              );})}`);

// 5. Add Pagination Controls
// Let's add them at the bottom of both mobile and desktop view
const paginationControls = `
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
`;

// Insert after table desktop view
content = content.replace(/<\/table>\n\s*<\/div>/, `</table>\n        </div>${paginationControls}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched SampleTestFormTab.jsx for pagination and auto-save');

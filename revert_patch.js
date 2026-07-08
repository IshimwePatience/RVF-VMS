const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/SampleTestFormTab.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove `disabled={isRowDisabled(index)} tabIndex={isRowDisabled(index) ? -1 : 0}` from <input and <select
content = content.replace(/ disabled=\{isRowDisabled\(index\)\} tabIndex=\{isRowDisabled\(index\) \? -1 : 0\}/g, '');
// For LocationDropdown we only did disabled
content = content.replace(/ disabled=\{isRowDisabled\(index\)\}/g, '');

// 2. Revert mobile wrapper
content = content.replace(
  /<fieldset key=\{index\} className=\{`bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4 transition-opacity \$\{isRowDisabled\(index\) \? "opacity-50" : ""\}`\}>/g,
  '<div key={index} className="bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">'
);
content = content.replace(
  /<\/fieldset>(\n\s*)\}\)\}(\n\s*)<\/div>(\n\n\s*)\{\/\* Desktop View/g,
  '</div>$1})\}$2</div>$3{/* Desktop View'
);

// 3. Revert table tr
content = content.replace(
  /<tr key=\{index\} className=\{`hover:bg-slate-50 transition-colors \$\{isRowDisabled\(index\) \? "opacity-40 pointer-events-none bg-slate-100" : ""\}`\}>/g,
  '<tr key={index} className="hover:bg-slate-50 transition-colors">'
);

// 4. Update handleRowChange
const handleRowChangeSig = 'const handleRowChange = (index, field, value) => {\n';
const handleRowChangePatch = `const handleRowChange = (index, field, value) => {
    if (isRowDisabled(index)) {
      setError(\`Please fill in the previous row before starting Sample #\${rows[index].sn}.\`);
      return;
    }
    if (error && error.includes('previous row before starting Sample')) {
      setError(null);
    }
`;

if (content.includes(handleRowChangeSig) && !content.includes('if (isRowDisabled(index)) {')) {
  content = content.replace(handleRowChangeSig, handleRowChangePatch);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Reverted gray-out and added message validation on handleRowChange');

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/SampleTestFormTab.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('const isRowDisabled')) {
  const insertIndex = content.indexOf('const handleSubmit = async (e) => {');
  const func = `  const isRowDisabled = (index) => {
    if (index === 0) return false;
    const prevRow = rows[index - 1];
    return !Object.entries(prevRow).some(([key, value]) => key !== 'sn' && value?.toString().trim() !== '');
  };\n\n  `;
  content = content.slice(0, insertIndex) + func + content.slice(insertIndex);
}

// Wrap mobile div in fieldset
content = content.replace(
  /<div key={index} className="bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">/g,
  '<fieldset key={index} disabled={isRowDisabled(index)} className={`bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4 transition-opacity ${isRowDisabled(index) ? "opacity-50" : ""}`}>'
);
// Fix the closing tag for the mobile view wrapper
// We know it's right before `))} </div> {/* Desktop View: Table (Hidden on sm) */}`
const mobileEndPattern = /<\/div>\n\s*\}\)\}\n\s*<\/div>\n\n\s*\{\/\* Desktop View/;
content = content.replace(
  /<\/div>(\n\s*)\}\)\}(\n\s*)<\/div>(\n\n\s*)\{\/\* Desktop View/g,
  '</fieldset>$1})\}$2</div>$3{/* Desktop View'
);

// Add opacity to table row
content = content.replace(
  /<tr key={index} className="hover:bg-slate-50 transition-colors">/g,
  '<tr key={index} className={`hover:bg-slate-50 transition-colors ${isRowDisabled(index) ? "opacity-40 pointer-events-none bg-slate-100" : ""}`}>'
);

// Add disabled and tabIndex to table inputs
const tbodyIndex = content.indexOf('<tbody>');
const tbodyEndIndex = content.indexOf('</tbody>');
if (tbodyIndex !== -1 && tbodyEndIndex !== -1) {
  let tbodyContent = content.slice(tbodyIndex, tbodyEndIndex);
  tbodyContent = tbodyContent
    .replace(/<input /g, '<input disabled={isRowDisabled(index)} tabIndex={isRowDisabled(index) ? -1 : 0} ')
    .replace(/<select /g, '<select disabled={isRowDisabled(index)} tabIndex={isRowDisabled(index) ? -1 : 0} ')
    .replace(/<LocationDropdown /g, '<LocationDropdown disabled={isRowDisabled(index)} ');
  content = content.slice(0, tbodyIndex) + tbodyContent + content.slice(tbodyEndIndex);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched SampleTestFormTab.jsx');

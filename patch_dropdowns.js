const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/SampleTestFormTab.jsx');

let content = fs.readFileSync(targetFile, 'utf8');

// Ensure import for SearchableDropdown
if (!content.includes("import SearchableDropdown")) {
  content = content.replace(
    "import LocationDropdown from '../../components/LocationDropdown';",
    "import LocationDropdown from '../../components/LocationDropdown';\nimport SearchableDropdown from '../../components/SearchableDropdown';"
  );
}

// 1. District Origin
content = content.replace(
  /<select className="[^"]+" value=\{row\.district_origin\} onChange=\{\(e\) => handleRowChange\(index, 'district_origin', e\.target\.value\)\}>\s*<option value=""><\/option>\s*\{RWANDA_DISTRICTS\.map\(d => <option key=\{d\} value=\{d\}>\{d\}<\/option>\)\}\s*<\/select>/g,
  `<LocationDropdown type="districts" value={row.district_origin} onChange={(val) => handleRowChange(index, 'district_origin', val)} placeholder="District" />`
);

// 2. Specie
content = content.replace(
  /<select className="[^"]+" value=\{row\.specie\} onChange=\{\(e\) => handleRowChange\(index, 'specie', e\.target\.value\)\}>\s*<option value=""><\/option>\s*<option value="Cattle">Cattle<\/option>\s*<option value="Sheep">Sheep<\/option>\s*<option value="Goat">Goat<\/option>\s*<\/select>/g,
  `<SearchableDropdown options={['Cattle', 'Sheep', 'Goat']} value={row.specie} onChange={(val) => handleRowChange(index, 'specie', val)} placeholder="Specie" />`
);

// 3. Sex
content = content.replace(
  /<select className="[^"]+" value=\{row\.sex\} onChange=\{\(e\) => handleRowChange\(index, 'sex', e\.target\.value\)\}>\s*<option value=""><\/option>\s*<option value="Male">Male<\/option>\s*<option value="Female">Female<\/option>\s*<\/select>/g,
  `<SearchableDropdown options={['Male', 'Female']} value={row.sex} onChange={(val) => handleRowChange(index, 'sex', val)} placeholder="Sex" />`
);

// 4. Vaccination Status
content = content.replace(
  /<select className="[^"]+" value=\{row\.vaccination_status\} onChange=\{\(e\) => handleRowChange\(index, 'vaccination_status', e\.target\.value\)\}>\s*<option value=""><\/option>\s*<option value="Yes">Yes<\/option>\s*<option value="No">No<\/option>\s*<\/select>/g,
  `<SearchableDropdown options={['Yes', 'No']} value={row.vaccination_status} onChange={(val) => handleRowChange(index, 'vaccination_status', val)} placeholder="Vaccination" />`
);

// 5. Purpose
content = content.replace(
  /<select className="[^"]+" value=\{row\.purpose\} onChange=\{\(e\) => handleRowChange\(index, 'purpose', e\.target\.value\)\}>\s*<option value=""><\/option>\s*<option value="Diagnosis">Diagnosis<\/option>\s*<option value="Surveillance">Surveillance<\/option>\s*<\/select>/g,
  `<SearchableDropdown options={['Diagnosis', 'Surveillance']} value={row.purpose} onChange={(val) => handleRowChange(index, 'purpose', val)} placeholder="Purpose" />`
);

// 6. Health Status
content = content.replace(
  /<select className="[^"]+" value=\{row\.health_status\} onChange=\{\(e\) => handleRowChange\(index, 'health_status', e\.target\.value\)\}>\s*<option value=""><\/option>\s*<option value="Sick">Sick<\/option>\s*<option value="Normal">Normal<\/option>\s*<option value="Control">Control<\/option>\s*<\/select>/g,
  `<SearchableDropdown options={['Sick', 'Normal', 'Control']} value={row.health_status} onChange={(val) => handleRowChange(index, 'health_status', val)} placeholder="Health Status" />`
);

// 7. Header District (if any)
content = content.replace(
  /<select required value=\{headerData\.district\} onChange=\{\(e\) => handleHeaderChange\('district', e\.target\.value\)\} className="[^"]+">\s*<option value="">Select District<\/option>\s*\{RWANDA_DISTRICTS\.map\(d => <option key=\{d\} value=\{d\}>\{d\}<\/option>\)\}\s*<\/select>/g,
  `<div className="flex-1 border-b border-dotted border-slate-400 pb-1">\n                <LocationDropdown type="districts" value={headerData.district} onChange={(val) => handleHeaderChange('district', val)} placeholder="Select District" />\n              </div>`
);


fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully patched SampleTestFormTab.jsx for searchable dropdowns');

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/HomeVaccinationTab.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useEffect to import if missing
if (!content.includes("import React, { useState, useEffect }")) {
  content = content.replace("import React, { useState }", "import React, { useState, useEffect }");
}

// 2. Replace the useState initialization for homes
const oldState = `  const [homes, setHomes] = useState([
    {
      id: Date.now(),
      owner_name: '',
      owner_phone: '',
      owner_national_id: '',
      animals: [
        { id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }
      ]
    }
  ]);`;

const newState = `  const [homes, setHomes] = useState(() => {
    const saved = localStorage.getItem('rvf_vaccination_form_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: Date.now(),
        owner_name: '',
        owner_phone: '',
        owner_national_id: '',
        animals: [
          { id: Date.now() + 1, animal_type: '', vaccine_selection: [], dose_given: 1, damages: 0 }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rvf_vaccination_form_draft', JSON.stringify(homes));
  }, [homes]);`;

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
}

// 3. Clear localStorage on successful submission
// Let's find onSuccess in submitMutation
const onSuccessOld = `onSuccess: () => {
      setSuccess(true);
      setHomes([`;

const onSuccessNew = `onSuccess: () => {
      setSuccess(true);
      localStorage.removeItem('rvf_vaccination_form_draft');
      setHomes([`;

if (content.includes(onSuccessOld)) {
  content = content.replace(onSuccessOld, onSuccessNew);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched HomeVaccinationTab.jsx');

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/src/pages/VeterinaryPortal/SampleTestFormTab.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace standard headers with resizable div wrappers
// We will match the <th className="...">Text</th> and wrap the Text in a div with resize-x
content = content.replace(/<th className="border border-slate-300 p-2 font-bold min-w-\[(\d+)px\] text-slate-800">(.*?)<\/th>/g, (match, minW, innerText) => {
  // Increase min-width for dropdown columns to prevent squishing
  let newMinW = parseInt(minW);
  if (innerText.includes('District') || innerText.includes('Sector') || innerText.includes('Cell') || innerText.includes('Village')) {
    newMinW = Math.max(newMinW, 140);
  } else if (innerText.includes('Sex') || innerText.includes('Specie')) {
    newMinW = Math.max(newMinW, 110);
  } else if (innerText.includes('Status') || innerText.includes('Purpose')) {
    newMinW = Math.max(newMinW, 120);
  } else {
    // Other columns like Animal Id, Farmer Name etc
    newMinW = Math.max(newMinW, 100); 
  }

  return `<th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">\n                  <div className="resize-x overflow-auto p-2 min-w-[${newMinW}px] h-full flex items-center justify-center font-bold">\n                    ${innerText}\n                  </div>\n                </th>`;
});

// Also replace the 'S/N' header which has a different class "w-12"
content = content.replace(/<th className="border border-slate-300 p-2 font-bold w-12 text-slate-800">S\/N<\/th>/g, 
  `<th className="border border-slate-300 p-0 text-slate-800 bg-slate-100">\n                  <div className="resize-x overflow-auto p-2 min-w-[60px] h-full flex items-center justify-center font-bold">\n                    S/N\n                  </div>\n                </th>`
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully patched SampleTestFormTab.jsx headers for resize-x');

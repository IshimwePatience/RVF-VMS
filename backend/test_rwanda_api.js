const rwanda = require('rwanda');

try {
  console.log("ALL PROVINCES:", rwanda.Provinces());
  
  // Try to find the exact province name for Bugesera
  // Let's print out the first few districts of each province
  const allProvinces = rwanda.Provinces();
  for (const p of allProvinces) {
    console.log(`Districts for ${p}:`, rwanda.Districts(p).slice(0, 3));
  }
  
  console.log("Testing Sectors with various cases:");
  try { console.log("East, Bugesera:", rwanda.Sectors('East', 'Bugesera').length); } catch(e) { console.error("East failed", e.message); }
  try { console.log("east, bugesera:", rwanda.Sectors('east', 'bugesera').length); } catch(e) { console.error("east failed", e.message); }
  try { console.log("Eastern, Bugesera:", rwanda.Sectors('Eastern', 'Bugesera').length); } catch(e) { console.error("Eastern failed", e.message); }
  
  try { console.log("undefined, Bugesera:", rwanda.Sectors(undefined, 'Bugesera').length); } catch(e) { console.error("undefined failed", e.message); }
  try { console.log("null, Bugesera:", rwanda.Sectors(null, 'Bugesera').length); } catch(e) { console.error("null failed", e.message); }

  console.log("Testing full export size:");
  const allSectors = rwanda.Sectors();
  console.log("Total sectors:", allSectors.length);
} catch (e) {
  console.error(e);
}

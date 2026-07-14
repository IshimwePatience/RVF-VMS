const { LabResult, SurveillanceSample } = require('./models');

async function fixAges() {
  try {
    console.log('Fetching all Lab Results from the database...');
    const results = await LabResult.findAll();
    
    let fixedCount = 0;
    let skippedCount = 0;

    for (const r of results) {
      if (!r.animal_id) {
        skippedCount++;
        continue;
      }

      // Check if the current saved age is incorrectly matching the village name
      if (r.age && r.village && r.age.trim().toLowerCase() === r.village.trim().toLowerCase()) {
        
        // Find the original surveillance sample to get the REAL age
        const sample = await SurveillanceSample.findOne({ 
          where: { animal_id: r.animal_id }
        });

        if (sample && sample.age) {
          r.age = sample.age;
          await r.save();
          fixedCount++;
          console.log(`Fixed Animal ID ${r.animal_id}: Age changed from '${r.village}' to '${sample.age}'`);
        } else {
          // If the original sample doesn't exist or didn't have an age, just clear the wrong village name
          r.age = sample ? (sample.age || '') : '';
          await r.save();
          fixedCount++;
          console.log(`Fixed Animal ID ${r.animal_id}: Cleared incorrect age (No original age found)`);
        }
      } else {
        skippedCount++;
      }
    }

    console.log('\n--- Fix Completed ---');
    console.log(`Successfully fixed: ${fixedCount} records.`);
    console.log(`Skipped (already correct): ${skippedCount} records.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing ages:', error);
    process.exit(1);
  }
}

fixAges();

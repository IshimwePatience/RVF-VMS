const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function check() {
  try {
    const samples = await SurveillanceSample.findAll();
    const ids = {};
    for (let s of samples) {
      // Differentiate duplicates globally across ALL submissions.
      // We consider it a duplicate if all these fields match exactly.
      
      let key = '';
      
      // We must have some way to identify it. Animal ID is best.
      if (s.animal_id) {
        key += `animal_${s.animal_id.trim().toLowerCase()}`;
      } else {
        // Without an animal ID, it's very hard to say it's a true duplicate just based on farmer name, 
        // because a farmer can have multiple animals of the same sex/specie.
        key += `id_${s.id}`;
      }

      // Add other attributes that define this specific animal.
      key += `_farmer_${(s.farmer_name || '').trim().toLowerCase()}`;
      key += `_specie_${(s.specie || '').trim().toLowerCase()}`;
      key += `_breed_${(s.breed || '').trim().toLowerCase()}`;
      key += `_sex_${(s.sex || '').trim().toLowerCase()}`;
      key += `_age_${(s.age || '').trim().toLowerCase()}`;

      // Optionally we could add phone or location, but the above is usually sufficient for a unique animal.
      
      if (!ids[key]) ids[key] = [];
      ids[key].push(s);
    }

    let found = false;
    let deletedCount = 0;
    
    const labResults = await LabResult.findAll();
    const labResultTrackingIds = new Set(labResults.map(lr => lr.sample_tracking_id).filter(Boolean));

    for (let key in ids) {
      if (ids[key].length > 1) {
        console.log(`\nDuplicate found! Key: ${key}`);
        found = true;
        
        const group = ids[key];
        let keepSample = null;
        
        // Find if any has a lab result
        const samplesWithResults = group.filter(s => labResultTrackingIds.has(s.tracking_id));
        
        if (samplesWithResults.length > 0) {
          keepSample = samplesWithResults[0];
        } else {
          keepSample = group[0];
        }

        for (let s of group) {
          if (s.id === keepSample.id) {
             console.log(`  KEEPING -> Sample ID: ${s.id}, Tracking ID: ${s.tracking_id}`);
          } else {
             console.log(`  DELETING -> Sample ID: ${s.id}, Tracking ID: ${s.tracking_id}`);
             await s.destroy();
             deletedCount++;
          }
        }
      }
    }
    
    if (!found) {
      console.log('No duplicates found based on strict global criteria (animal ID, farmer, species, breed, sex, age).');
    } else {
      console.log(`\nCleanup complete. Deleted ${deletedCount} duplicate samples.`);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
check();

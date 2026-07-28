const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function check() {
  try {
    const samples = await SurveillanceSample.findAll({
      include: [{ model: SurveillanceForm }]
    });
    const ids = {};
    for (let s of samples) {
      // Differentiate duplicates strictly. We look across ALL records.
      // A true duplicate is exactly the same data for the same farmer/animal in the same submission form.
      // Even if the animal_id is the same, if it is submitted on different forms (different days), it's NOT a duplicate, it's just tested again.
      // If it's submitted on the SAME form twice (like clicking submit twice, or adding the same animal twice to the form), it IS a duplicate.
      
      let key = `form_${s.form_id}_`;
      
      if (s.animal_id) {
        key += `animal_${s.animal_id.trim().toLowerCase()}`;
      } else if (s.farmer_name) {
        key += `farmer_${s.farmer_name.trim().toLowerCase()}_specie_${s.specie}_sex_${s.sex}`;
      } else {
        key += `id_${s.id}`; // No animal ID or farmer name? Can't really deduplicate it safely.
      }
      
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
      console.log('No duplicates found based on strict within-form criteria.');
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

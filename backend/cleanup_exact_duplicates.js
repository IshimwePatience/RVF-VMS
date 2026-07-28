const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function cleanupDuplicates() {
  try {
    console.log('--- STARTING SAFE DUPLICATE CLEANUP ---');
    
    // 1. Fetch all samples and their associated forms
    const samples = await SurveillanceSample.findAll({
      include: [{ model: SurveillanceForm }]
    });

    // 2. Fetch all lab results
    const labResults = await LabResult.findAll();
    const labResultTrackingIds = new Set(labResults.map(lr => lr.sample_tracking_id).filter(Boolean));

    // 3. Group samples by ALL their attributes (except IDs, timestamps, and tracking_id)
    // This ensures we only group EXACT duplicates
    const groups = {};
    for (let s of samples) {
      // If a sample has no animal_id, we can't safely deduplicate it.
      if (!s.animal_id) continue;
      
      const form = s.SurveillanceForm;
      const collectionDate = form ? form.collection_date : 'unknown';

      // We use JSON.stringify to create a hash of the exact entire line properties
      const matchCriteria = {
        collection_date: collectionDate,
        animal_id: String(s.animal_id).trim().toLowerCase(),
        farmer_name: String(s.farmer_name || '').trim().toLowerCase(),
        phone: String(s.phone || '').trim().toLowerCase(),
        specie: String(s.specie || '').trim().toLowerCase(),
        breed: String(s.breed || '').trim().toLowerCase(),
        sex: String(s.sex || '').trim().toLowerCase(),
        age: String(s.age || '').trim().toLowerCase(),
        district_origin: String(s.district_origin || '').trim().toLowerCase(),
        sector: String(s.sector || '').trim().toLowerCase(),
        cell: String(s.cell || '').trim().toLowerCase(),
        village: String(s.village || '').trim().toLowerCase()
      };

      const key = JSON.stringify(matchCriteria);
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(s);
    }

    let foundDuplicates = 0;
    let deletedCount = 0;

    // 4. Process groups that have more than 1 sample (Duplicates found!)
    for (let key in groups) {
      if (groups[key].length > 1) {
        foundDuplicates++;
        const group = groups[key];
        
        console.log(`\nFound exact duplicates for Animal ID: ${group[0].animal_id}`);
        console.log(`  Count: ${group.length} duplicates`);

        let keepSample = null;
        
        // Split the group into those WITH lab results and those WITHOUT
        const samplesWithResults = group.filter(s => labResultTrackingIds.has(s.tracking_id));
        const samplesWithoutResults = group.filter(s => !labResultTrackingIds.has(s.tracking_id));
        
        if (samplesWithResults.length > 0) {
          // If at least one has a result, keep the FIRST one that has a result
          keepSample = samplesWithResults[0];
          console.log(`  Action: Keeping Tracking ID ${keepSample.tracking_id} because it HAS LAB RESULTS.`);
        } else {
          // If none have results, keep the FIRST one submitted
          keepSample = group[0];
          console.log(`  Action: Keeping Tracking ID ${keepSample.tracking_id} (None had results).`);
        }

        // Delete the rest
        for (let s of group) {
          if (s.id !== keepSample.id) {
             console.log(`    -> DELETING Tracking ID: ${s.tracking_id} (Status: ${labResultTrackingIds.has(s.tracking_id) ? 'Has Result' : 'Pending'})`);
             await s.destroy();
             deletedCount++;
          }
        }
      }
    }
    
    if (foundDuplicates === 0) {
      console.log('\nNo exact duplicates found based on all columns and collection date.');
    } else {
      console.log(`\nCleanup complete! Safely deleted ${deletedCount} duplicate pending samples while keeping the ones with results.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDuplicates();

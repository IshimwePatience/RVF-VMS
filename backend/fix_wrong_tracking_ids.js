const { SurveillanceSample, LabResult, sequelize } = require('./models');

async function fixWrongTrackingIds() {
  try {
    console.log('Starting cleanup of corrupted Tracking IDs...');
    const results = await LabResult.findAll();
    let fixedCount = 0;

    for (const r of results) {
      if (r.sample_tracking_id) {
        // Fetch the SurveillanceSample this result is linked to
        const sample = await SurveillanceSample.findOne({
          where: { tracking_id: r.sample_tracking_id }
        });

        if (sample) {
          const resultFarmer = (r.farmer_name || '').trim().toLowerCase();
          const sampleFarmer = (sample.farmer_name || '').trim().toLowerCase();
          
          // If the farmer names are completely different, the migration script linked them wrongly
          if (resultFarmer && sampleFarmer && resultFarmer !== sampleFarmer) {
            console.log(`Unlinking: LabResult (Farmer: ${resultFarmer}) from Tracking ID ${r.sample_tracking_id} (Vet's Farmer: ${sampleFarmer})`);
            await r.update({ sample_tracking_id: null });
            fixedCount++;
          }
        }
      }
    }

    console.log(`\nCleanup Complete! Successfully unlinked ${fixedCount} corrupted Lab Results.`);
    console.log('These Lab Results will no longer show up under the wrong Veterinary accounts.');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

fixWrongTrackingIds();

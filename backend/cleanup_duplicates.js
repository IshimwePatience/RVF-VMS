const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function cleanup() {
  try {
    console.log('Starting cleanup of duplicate samples...');
    
    // Fetch all samples with their forms
    const samples = await SurveillanceSample.findAll({
      include: [{
        model: SurveillanceForm
      }]
    });

    const labResults = await LabResult.findAll();
    const labResultTrackingIds = new Set(labResults.map(lr => lr.sample_tracking_id).filter(Boolean));

    // Group by animal_id and createdAt date
    const groups = {};
    for (const sample of samples) {
      if (!sample.animal_id) continue;
      
      const date = new Date(sample.createdAt).toISOString().split('T')[0];
      const key = `${sample.animal_id.trim().toLowerCase()}_${date}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(sample);
    }

    let deletedSamples = 0;

    for (const key in groups) {
      const group = groups[key];
      if (group.length > 1) {
        // We have duplicates!
        // Find if any has a lab result
        let keepSample = null;
        const samplesWithResults = group.filter(s => labResultTrackingIds.has(s.tracking_id));
        
        if (samplesWithResults.length > 0) {
          // Keep the first one with a result
          keepSample = samplesWithResults[0];
        } else {
          // Keep the first one
          keepSample = group[0];
        }

        // Delete others
        for (const sample of group) {
          if (sample.id !== keepSample.id) {
            console.log(`Deleting duplicate sample ID ${sample.id} (Tracking ID: ${sample.tracking_id}) - Keeping ID ${keepSample.id}`);
            await sample.destroy();
            deletedSamples++;
          }
        }
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedSamples} duplicate samples.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();

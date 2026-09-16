const { SurveillanceSample } = require('./models');

// Add all 10 red sample tracking IDs here
const RED_SAMPLES_TO_RESET = [
  'RAB-C58516',
  'RAB-4285BA',
  'RAB-202A3A'
  // Add remaining red sample tracking IDs here if there are more
];

async function resetRedSamplesToPending() {
  try {
    console.log(`Targeting ONLY the following ${RED_SAMPLES_TO_RESET.length} red samples:`);
    console.log(RED_SAMPLES_TO_RESET);

    // 1. First find matching records to verify count before updating
    const existingSamples = await SurveillanceSample.findAll({
      where: {
        tracking_id: RED_SAMPLES_TO_RESET
      }
    });

    console.log(`Found ${existingSamples.length} matching sample(s) in the database.`);

    if (existingSamples.length === 0) {
      console.log('No matching samples found. No changes made.');
      process.exit(0);
    }

    // 2. Safely update ONLY these specific tracking IDs to 'Pending'
    const [updatedCount] = await SurveillanceSample.update(
      {
        daro_approval_status: 'Pending',
        daro_approved_by: null,
        daro_approval_date: null
      },
      {
        where: {
          tracking_id: RED_SAMPLES_TO_RESET
        }
      }
    );

    console.log(`SUCCESS: Successfully reset ${updatedCount} red sample(s) back to 'Pending'.`);
    console.log('All other samples were untouched.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting samples to pending:', error);
    process.exit(1);
  }
}

resetRedSamplesToPending();

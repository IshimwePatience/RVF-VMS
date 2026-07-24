const { sequelize, SurveillanceSample, LabResult, SurveillanceForm } = require('./models');
const crypto = require('crypto');

async function generateUniqueTrackingId() {
  while (true) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const tracking_id = `RAB-${randomHex}`;
    const exists = await SurveillanceSample.findOne({ where: { tracking_id } });
    if (!exists) {
      return tracking_id;
    }
  }
}

async function run() {
  try {
    console.log('Starting migration to add tracking IDs...');
    
    // Add columns if they don't exist
    try {
      await sequelize.query('ALTER TABLE "SurveillanceSamples" ADD COLUMN "tracking_id" VARCHAR(255) UNIQUE;');
      console.log('Added tracking_id to SurveillanceSamples');
    } catch (e) {
      console.log('tracking_id column might already exist in SurveillanceSamples: ' + e.message);
    }
    
    try {
      await sequelize.query('ALTER TABLE "LabResults" ADD COLUMN "sample_tracking_id" VARCHAR(255);');
      console.log('Added sample_tracking_id to LabResults');
    } catch (e) {
      console.log('sample_tracking_id column might already exist in LabResults: ' + e.message);
    }

    // Process existing SurveillanceSamples
    console.log('Generating tracking IDs for existing samples...');
    const samples = await SurveillanceSample.findAll({ where: { tracking_id: null } });
    for (const sample of samples) {
      const tracking_id = await generateUniqueTrackingId();
      await sample.update({ tracking_id });
    }
    console.log(`Updated ${samples.length} samples with tracking IDs.`);

    // Process existing LabResults (try to link them via the old fuzzy logic once and for all)
    console.log('Attempting to link existing Lab Results...');
    const results = await LabResult.findAll({ where: { sample_tracking_id: null } });
    let linkedCount = 0;
    
    // Build a map of samples
    const allForms = await SurveillanceForm.findAll({
      include: [{ model: SurveillanceSample, as: 'samples' }]
    });

    const validSamplesMap = {};
    for (const form of allForms) {
      const formDate = new Date(form.createdAt);
      if (form.samples) {
        for (const sample of form.samples) {
          if (sample.animal_id && sample.tracking_id) {
            const searchId = String(sample.animal_id).trim().toLowerCase();
            if (!validSamplesMap[searchId]) {
              validSamplesMap[searchId] = [];
            }
            validSamplesMap[searchId].push({
              tracking_id: sample.tracking_id,
              searchFarmer: (sample.farmer_name || form.farmer_name || '').trim().toLowerCase(),
              searchPhone: (sample.phone || form.phone_number || form.veterinary_email || '').trim().toLowerCase(),
              searchDistrict: (sample.district_origin || form.district || '').trim().toLowerCase(),
              searchSpecie: (sample.specie || '').trim().toLowerCase(),
              formDate
            });
          }
        }
      }
    }

    for (const lr of results) {
      const lrId = lr.animal_id ? String(lr.animal_id).trim().toLowerCase() : '';
      const matchingSamples = validSamplesMap[lrId];
      if (!matchingSamples || matchingSamples.length === 0) continue;

      const lrFarmer = lr.farmer_name ? String(lr.farmer_name).trim().toLowerCase() : '';
      const lrPhone = lr.phone ? String(lr.phone).trim().toLowerCase() : '';
      const lrDistrict = lr.animal_district_origin ? String(lr.animal_district_origin).trim().toLowerCase() : '';
      const lrSpecie = lr.specie ? String(lr.specie).trim().toLowerCase() : '';

      // Find the best match
      const match = matchingSamples.find(s => {
        let matches = 0;
        let conditions = 0;

        if (s.searchDistrict && lrDistrict) { conditions++; if (s.searchDistrict === lrDistrict) matches++; }
        if (s.searchPhone && lrPhone) { conditions++; if (s.searchPhone === lrPhone) matches++; }
        if (s.searchFarmer && lrFarmer) { conditions++; if (s.searchFarmer === lrFarmer) matches++; }
        if (s.searchSpecie && lrSpecie) { conditions++; if (s.searchSpecie === lrSpecie) matches++; }

        return conditions === 0 || matches > 0;
      });

      if (match) {
        await lr.update({ sample_tracking_id: match.tracking_id });
        linkedCount++;
      }
    }
    console.log(`Successfully linked ${linkedCount} out of ${results.length} legacy Lab Results.`);

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();

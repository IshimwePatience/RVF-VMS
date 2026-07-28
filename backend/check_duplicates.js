const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function check() {
  try {
    const samples = await SurveillanceSample.findAll();
    const ids = {};
    for (let s of samples) {
      if (s.animal_id) {
        if (!ids[s.animal_id]) ids[s.animal_id] = [];
        ids[s.animal_id].push(s);
      }
    }

    let found = false;
    for (let animalId in ids) {
      if (ids[animalId].length > 1) {
        console.log(`Duplicate found! Animal ID: ${animalId}`);
        for (let s of ids[animalId]) {
          console.log(`  Sample ID: ${s.id}, Tracking ID: ${s.tracking_id}, Form ID: ${s.form_id}, Created: ${s.createdAt}`);
        }
        found = true;
      }
    }
    
    if (!found) {
      console.log('No duplicates found sharing the same animal_id.');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
check();

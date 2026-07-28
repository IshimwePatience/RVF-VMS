const { sequelize, SurveillanceSample, SurveillanceForm, LabResult } = require('./models');

async function check() {
  try {
    const samples = await SurveillanceSample.findAll();
    const ids = {};
    for (let s of samples) {
      let key = '';
      if (s.animal_id) {
        key = `animal_${s.animal_id.trim().toLowerCase()}`;
      } else if (s.farmer_name) {
        key = `farmer_${s.farmer_name.trim().toLowerCase()}_specie_${s.specie}_sex_${s.sex}`;
      }
      
      if (key) {
        if (!ids[key]) ids[key] = [];
        ids[key].push(s);
      }
    }

    let found = false;
    for (let key in ids) {
      if (ids[key].length > 1) {
        console.log(`Duplicate found! Key: ${key}`);
        for (let s of ids[key]) {
          console.log(`  Sample ID: ${s.id}, Tracking ID: ${s.tracking_id}, Form ID: ${s.form_id}, Created: ${s.createdAt}`);
        }
        found = true;
      }
    }
    
    if (!found) {
      console.log('No duplicates found.');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
check();

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { LabTechnician } = require('./models');

async function resetLabTechPasswords() {
  try {
    const techs = await LabTechnician.findAll();
    console.log(`Found ${techs.length} Lab Technicians.`);
    
    const password_hash = await bcrypt.hash('123456', 10);
    let count = 0;

    for (const tech of techs) {
      // Only set password if they don't have one, or maybe reset all to be safe.
      // The user wants existing lab techs to use the temporary password.
      tech.password_hash = password_hash;
      tech.must_change_password = true;
      await tech.save();
      count++;
    }

    console.log(`Successfully reset passwords for ${count} Lab Technicians.`);
  } catch (error) {
    console.error('Error resetting passwords:', error);
  }
  process.exit();
}

resetLabTechPasswords();

require('dotenv').config();
const { sequelize } = require('./models');

async function alterDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.query('ALTER TABLE "LabTechnicians" ADD COLUMN password_hash VARCHAR(255) NULL;');
    console.log('password_hash column added.');
  } catch (err) {
    console.error('Error adding password_hash column:', err.message);
  }

  try {
    await sequelize.query('ALTER TABLE "LabTechnicians" ADD COLUMN must_change_password BOOLEAN DEFAULT false;');
    console.log('must_change_password column added.');
  } catch (err) {
    console.error('Error adding must_change_password column:', err.message);
  }

  process.exit();
}

alterDb();

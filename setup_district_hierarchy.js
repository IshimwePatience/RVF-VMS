const { Stock, User } = require('./backend/models');
const { sequelize } = require('./backend/models');

async function migrate() {
  await sequelize.authenticate();

  const zipline = await Stock.findOne({ where: { name: 'ZIPLINE' } });
  if (!zipline) {
    console.log('ZIPLINE stock not found');
    process.exit();
  }

  // Create Gasabo District Stock
  let gasaboDistrict = await Stock.findOne({ where: { name: 'Gasabo District', district: 'Gasabo', sector: null } });
  if (!gasaboDistrict) {
    gasaboDistrict = await Stock.create({
      name: 'Gasabo District',
      parent_stock_id: zipline.id,
      is_central: false,
      is_endpoint: false,
      province: 'Kigali City',
      district: 'Gasabo',
      sector: null
    });
    console.log('Created Gasabo District Stock');
  }

  // Create a user for Gasabo District
  const districtUser = await User.findOne({ where: { username: 'gasabo_district' } });
  if (!districtUser) {
    await User.create({
      username: 'gasabo_district',
      email: 'district@gasabo.gov.rw',
      password_hash: '$2a$10$yO0L6bZ/.6JbQ.6JbQ.6JbQ.6JbQ.6JbQ.6JbQ.6JbQ.6JbQ.6JbQ', // dummy
      role: 'District',
      stock_id: gasaboDistrict.id,
      must_change_password: false
    });
    console.log('Created Gasabo District User');
  }

  // Update Umurenge Kigali (Sector) to point to Gasabo District
  const sector = await Stock.findOne({ where: { name: 'Umurenge Kigali' } });
  if (sector) {
    sector.parent_stock_id = gasaboDistrict.id;
    await sector.save();
    console.log('Updated Umurenge Kigali parent to Gasabo District');
  }

  console.log('Hierarchy updated successfully');
  process.exit();
}

migrate();

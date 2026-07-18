require('dotenv').config();
const { sequelize } = require('./models');

async function run() {
  await sequelize.query('UPDATE "LabTechnicians" SET password_hash = \'$2a$10$C8.M/Y4l6DkE5s.17ZqMze/i6B96T960r35O.rN.vP4.z5vU6kXQG\', must_change_password = true;');
  console.log('done');
  process.exit();
}
run();

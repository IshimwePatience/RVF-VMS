const db = require('./models');

db.sequelize.query('ALTER TABLE "Veterinaries" ALTER COLUMN email DROP NOT NULL')
  .then(() => {
    console.log('Altered successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

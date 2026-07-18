const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run("ALTER TABLE LabTechnicians ADD COLUMN password_hash VARCHAR(255) NULL;", (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding password_hash column', err);
    } else {
      console.log('password_hash column added or already exists.');
    }
  });

  db.run("ALTER TABLE LabTechnicians ADD COLUMN must_change_password TINYINT(1) DEFAULT 0;", (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding must_change_password column', err);
    } else {
      console.log('must_change_password column added or already exists.');
    }
  });
});

db.close(() => {
  console.log('Database connection closed.');
});

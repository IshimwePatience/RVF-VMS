const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
    process.exit(1);
  }
});

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
  console.log(rows);
});

db.close();

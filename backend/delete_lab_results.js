const { LabResult } = require('./models');

async function deleteResults() {
  try {
    console.log('Connecting to database and deleting lab results...');
    const deletedCount = await LabResult.destroy({ where: {} });
    console.log(`Successfully deleted ${deletedCount} testing lab results.`);
    process.exit(0);
  } catch (err) {
    console.error('Error deleting lab results:', err);
    process.exit(1);
  }
}

deleteResults();

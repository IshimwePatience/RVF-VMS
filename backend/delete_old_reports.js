const { Op } = require('sequelize');
const { 
  SurveillanceForm, 
  SurveillanceSample, 
  HomeVaccinationRecord, 
  AdministrationRecord, 
  Request 
} = require('./models');

async function deleteOldReports() {
  // We set the cutoff to exactly the start of the 12th of July 2026
  const cutoffDate = new Date('2026-07-12T00:00:00.000Z');

  try {
    console.log('--- Cleaning up old reports ---');
    console.log('Deleting records older than:', cutoffDate.toISOString());

    const deletedSurveillance = await SurveillanceForm.destroy({
      where: { createdAt: { [Op.lt]: cutoffDate } }
    });
    console.log(`Deleted ${deletedSurveillance} Surveillance Forms (Sample Tests).`);

    // Just in case there are orphaned samples without a form, delete those too
    const deletedSamples = await SurveillanceSample.destroy({
      where: { createdAt: { [Op.lt]: cutoffDate } }
    });
    console.log(`Deleted ${deletedSamples} Orphaned Surveillance Samples.`);

    const deletedHomeVac = await HomeVaccinationRecord.destroy({
      where: { createdAt: { [Op.lt]: cutoffDate } }
    });
    console.log(`Deleted ${deletedHomeVac} Home Vaccination Records.`);

    const deletedAdmin = await AdministrationRecord.destroy({
      where: { createdAt: { [Op.lt]: cutoffDate } }
    });
    console.log(`Deleted ${deletedAdmin} Sector Vaccination Records.`);

    const deletedRequests = await Request.destroy({
      where: { createdAt: { [Op.lt]: cutoffDate } }
    });
    console.log(`Deleted ${deletedRequests} Inventory Requests.`);

    console.log('--- Cleanup complete! ---');
    process.exit(0);
  } catch (err) {
    console.error('Error deleting old records:', err);
    process.exit(1);
  }
}

deleteOldReports();

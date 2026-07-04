const { AdministrationRecord, HomeVaccinationRecord, Batch, Vaccine, sequelize } = require('../models');

exports.getOverview = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Fetch allocations
    const allocations = await AdministrationRecord.findAll({
      where: { email },
      include: [
        {
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    // Fetch usages
    const usages = await HomeVaccinationRecord.findAll({
      where: { veterinary_email: email }
    });

    // Aggregate
    const summary = {};

    // Process Allocations
    allocations.forEach(alloc => {
      if (!alloc.Batch || !alloc.Batch.Vaccine) return;
      
      const key = `${alloc.Batch.Vaccine.name} [Batch ${alloc.Batch.batch_number}]`;
      if (!summary[key]) {
        summary[key] = {
          startingBalance: 0,
          newReceived: 0,
          total: 0,
          usedVaccines: 0,
          damages: 0,
          totalBalance: 0
        };
      }
      
      summary[key].total += alloc.quantity;
      summary[key].startingBalance += alloc.quantity; // Simplify logic by treating all allocations as starting balance for now
    });

    // Process Usages
    usages.forEach(usage => {
      const key = `${usage.vaccine_name} [Batch ${usage.batch_number}]`;
      if (summary[key]) {
        summary[key].usedVaccines += (usage.dose_given || 0);
        summary[key].damages += (usage.damages || 0);
      }
    });

    // Calculate final balances
    Object.keys(summary).forEach(key => {
      summary[key].totalBalance = summary[key].total - summary[key].usedVaccines - summary[key].damages;
    });

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAvailableVaccines = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const allocations = await AdministrationRecord.findAll({
      where: { email },
      include: [
        {
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    const uniqueVaccines = [];
    const seen = new Set();

    allocations.forEach(alloc => {
      if (!alloc.Batch || !alloc.Batch.Vaccine) return;
      const key = `${alloc.Batch.Vaccine.name} [Batch ${alloc.Batch.batch_number}]`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVaccines.push({
          vaccine_name: alloc.Batch.Vaccine.name,
          batch_number: alloc.Batch.batch_number,
          display_name: key
        });
      }
    });

    res.json(uniqueVaccines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.recordVaccination = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, owner_name, owner_phone, owner_national_id, home_identifier, animals } = req.body;
    
    if (!email || !owner_name || !home_identifier || !animals || animals.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const recordsToCreate = animals.map(animal => ({
      veterinary_email: email,
      owner_name,
      owner_phone,
      owner_national_id,
      home_identifier,
      animal_type: animal.animal_type,
      animal_identification: animal.animal_identification,
      vaccine_name: animal.vaccine_name,
      batch_number: animal.batch_number,
      dose_given: animal.dose_given,
      damages: animal.damages || 0
    }));

    await HomeVaccinationRecord.bulkCreate(recordsToCreate, { transaction: t });
    await t.commit();
    
    res.status(201).json({ message: 'Vaccination records saved successfully' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

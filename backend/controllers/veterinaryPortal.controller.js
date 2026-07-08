const { AdministrationRecord, HomeVaccinationRecord, Batch, Vaccine, Stock, StockInventory, sequelize } = require('../models');

exports.getOverview = async (req, res) => {
  try {
    const { email, province, district, sector } = req.query;

    const allocWhere = {};
    const usageWhere = {};

    if (email) {
      allocWhere.email = email;
      usageWhere.veterinary_email = email;
    }
    if (province) {
      allocWhere.province = province;
      usageWhere.province = province;
    }
    if (district) {
      allocWhere.district = district;
      usageWhere.district = district;
    }
    if (sector) {
      allocWhere.sector = sector;
      usageWhere.sector = sector;
    }

    // Fetch allocations
    const allocations = await AdministrationRecord.findAll({
      where: allocWhere,
      include: [
        {
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    // Fetch usages
    const usages = await HomeVaccinationRecord.findAll({
      where: usageWhere
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
    const { email, owner_name, owner_phone, owner_national_id, home_identifier, animals, province, district, sector, cell, village } = req.body;
    
    if (!email || !owner_name || !home_identifier || !animals || animals.length === 0 || !district || !sector) {
      return res.status(400).json({ message: 'Missing required fields, including District and Sector' });
    }

    // Find the Stock representing this sector
    const sectorStock = await Stock.findOne({
      where: { district, sector }
    });

    if (!sectorStock) {
      return res.status(400).json({ message: `No inventory stock registered for Sector: ${sector}, District: ${district}` });
    }

    // Group required doses by batch
    const requiredDosesByBatch = {};
    animals.forEach(a => {
      if (!requiredDosesByBatch[a.batch_number]) requiredDosesByBatch[a.batch_number] = 0;
      requiredDosesByBatch[a.batch_number] += (parseInt(a.dose_given) || 0) + (parseInt(a.damages) || 0);
    });

    // Validate and deduct inventory
    for (const [batch_number, required_quantity] of Object.entries(requiredDosesByBatch)) {
      const batch = await Batch.findOne({ where: { batch_number } });
      if (!batch) return res.status(400).json({ message: `Batch ${batch_number} not found` });

      const inventory = await StockInventory.findOne({
        where: { stock_id: sectorStock.id, batch_id: batch.id },
        transaction: t
      });

      if (!inventory || inventory.quantity_available < required_quantity) {
        throw new Error(`Insufficient stock for batch ${batch_number} in Sector ${sector}. Needed: ${required_quantity}, Available: ${inventory ? inventory.quantity_available : 0}`);
      }

      inventory.quantity_available -= required_quantity;
      await inventory.save({ transaction: t });
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
      dose_given: parseInt(animal.dose_given) || 0,
      damages: parseInt(animal.damages) || 0,
      province, district, sector, cell, village,
      stock_id: sectorStock.id
    }));

    await HomeVaccinationRecord.bulkCreate(recordsToCreate, { transaction: t });
    await t.commit();
    
    res.status(201).json({ message: 'Vaccination records saved successfully' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.getAllVaccinations = async (req, res) => {
  try {
    const { email, province, district, sector } = req.query;
    const where = {};
    if (email) where.veterinary_email = email;
    if (province) where.province = province;
    if (district) where.district = district;
    if (sector) where.sector = sector;

    const records = await HomeVaccinationRecord.findAll({
      where,
      order: [['date_administered', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

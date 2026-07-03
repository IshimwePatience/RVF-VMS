const { AdministrationRecord, StockInventory, Stock, Batch, Vaccine, sequelize } = require('../models');
const { sendReportLinkEmail } = require('../utils/email');
const crypto = require('crypto');

exports.createAdministration = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { stock_id, batch_id, quantity, veterinary_name, province, district, sector, cell, village, phone_number, national_id, email } = req.body;

    // Check inventory
    const inventory = await StockInventory.findOne({
      where: { stock_id, batch_id },
      transaction: t
    });

    if (!inventory || inventory.quantity_available < quantity) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient inventory for this batch' });
    }

    // Create record
    const report_token = crypto.randomUUID();
    const record = await AdministrationRecord.create({
      stock_id,
      batch_id,
      quantity,
      veterinary_name,
      province,
      district,
      sector,
      cell,
      village,
      phone_number,
      national_id,
      email,
      report_token
    }, { transaction: t });

    // Deduct inventory
    inventory.quantity_available -= quantity;
    await inventory.save({ transaction: t });

    await t.commit();

    if (email) {
      sendReportLinkEmail(email, report_token, veterinary_name).catch(err => console.error('Failed to send report email:', err));
    }

    res.status(201).json(record);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdministrations = async (req, res) => {
  try {
    const { stock_id } = req.query;
    const whereClause = stock_id ? { stock_id } : {};

    const records = await AdministrationRecord.findAll({
      where: whereClause,
      include: [
        { model: Stock },
        { 
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ],
      order: [['date_administered', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReportDetails = async (req, res) => {
  try {
    const { token } = req.params;
    const record = await AdministrationRecord.findOne({
      where: { report_token: token },
      include: [
        { model: Stock },
        { 
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    if (!record) {
      return res.status(404).json({ message: 'Report link is invalid or expired.' });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitReport = async (req, res) => {
  try {
    const { token } = req.params;
    const { doses_used, doses_wasted, domestic_animals_vaccinated, animals_affected, animals_healed, animals_died } = req.body;
    
    const record = await AdministrationRecord.findOne({ where: { report_token: token } });
    if (!record) {
      return res.status(404).json({ message: 'Report link is invalid.' });
    }

    record.doses_used = doses_used;
    record.doses_wasted = doses_wasted;
    record.domestic_animals_vaccinated = domestic_animals_vaccinated;
    record.animals_affected = animals_affected;
    record.animals_healed = animals_healed;
    record.animals_died = animals_died;
    record.report_status = 'submitted';

    await record.save();

    res.json({ message: 'Report submitted successfully', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


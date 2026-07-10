const { AdministrationRecord, StockInventory, Stock, Batch, Vaccine, sequelize } = require('../models');
const { sendVeterinaryPortalLinkEmail } = require('../utils/email');
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

    // Check if this is the first time the veterinary is receiving vaccines
    const existingRecord = await AdministrationRecord.findOne({
      where: { email },
      transaction: t
    });
    const isFirstTime = !existingRecord;

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

    if (email && isFirstTime) {
      sendVeterinaryPortalLinkEmail(email, veterinary_name).catch(err => console.error('Failed to send portal email:', err));
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
    let whereClause = {};
    if (req.user && req.user.role !== 'Admin' && !req.user.is_central && req.user.district) {
      whereClause.district = req.user.district;
    } else if (stock_id) {
      whereClause.stock_id = stock_id;
    }

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
  const t = await sequelize.transaction();
  try {
    const { token } = req.params;
    const { 
      doses_used, doses_wasted, domestic_animals_vaccinated, 
      animals_affected, animals_healed, animals_died,
      owner_name, owner_phone, owner_national_id
    } = req.body;
    
    const record = await AdministrationRecord.findOne({ where: { report_token: token }, transaction: t });
    if (!record) {
      await t.rollback();
      return res.status(404).json({ message: 'Report link is invalid.' });
    }

    // Only return stock if the report hasn't been submitted yet. 
    // If it's already submitted and they are just updating, we'd need more complex logic. 
    // Assuming they can update, we should calculate the difference. 
    // Wait, the prompt says "can be updated later". If it's updated later, we shouldn't return vaccines twice!
    // To handle this simply without complex delta math, let's only return vaccines on the *first* submission.
    let unused_doses = 0;
    if (record.report_status === 'pending') {
      unused_doses = record.quantity - ((parseInt(doses_used) || 0) + (parseInt(doses_wasted) || 0));
    } else {
      // If updating, calculate the difference between old usage and new usage
      const oldUsage = (record.doses_used || 0) + (record.doses_wasted || 0);
      const newUsage = (parseInt(doses_used) || 0) + (parseInt(doses_wasted) || 0);
      unused_doses = oldUsage - newUsage; 
      // If newUsage < oldUsage, unused_doses is positive (we return more to stock)
      // If newUsage > oldUsage, unused_doses is negative (we take from stock)
    }

    record.doses_used = doses_used;
    record.doses_wasted = doses_wasted;
    record.domestic_animals_vaccinated = domestic_animals_vaccinated;
    record.animals_affected = animals_affected;
    record.animals_healed = animals_healed;
    record.animals_died = animals_died;
    record.owner_name = owner_name;
    record.owner_phone = owner_phone;
    record.owner_national_id = owner_national_id;
    record.report_status = 'submitted';

    await record.save({ transaction: t });

    if (unused_doses !== 0) {
      const inventory = await StockInventory.findOne({
        where: { stock_id: record.stock_id, batch_id: record.batch_id },
        transaction: t
      });
      if (inventory) {
        inventory.quantity_available += unused_doses;
        await inventory.save({ transaction: t });
      }
    }

    await t.commit();
    res.json({ message: 'Report submitted successfully', record });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAdministration = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { veterinary_name, province, district, sector, cell, village, phone_number, national_id, email, quantity } = req.body;
    
    const record = await AdministrationRecord.findByPk(id, { transaction: t });
    if (!record) {
      await t.rollback();
      return res.status(404).json({ message: 'Administration not found' });
    }

    if (quantity && quantity !== record.quantity) {
      const difference = record.quantity - quantity; 
      
      const inventory = await StockInventory.findOne({
        where: { stock_id: record.stock_id, batch_id: record.batch_id },
        transaction: t
      });
      
      if (inventory) {
        if (difference < 0 && inventory.quantity_available < Math.abs(difference)) {
          await t.rollback();
          return res.status(400).json({ message: 'Not enough stock available to increase quantity.' });
        }
        inventory.quantity_available += difference;
        await inventory.save({ transaction: t });
      }
      record.quantity = quantity;
    }

    record.veterinary_name = veterinary_name || record.veterinary_name;
    record.province = province || record.province;
    record.district = district || record.district;
    record.sector = sector || record.sector;
    record.cell = cell || record.cell;
    record.village = village || record.village;
    record.phone_number = phone_number || record.phone_number;
    record.national_id = national_id || record.national_id;
    record.email = email || record.email;

    await record.save({ transaction: t });
    await t.commit();
    
    res.json({ message: 'Administration updated successfully', record });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAdministration = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const record = await AdministrationRecord.findByPk(id, { transaction: t });
    if (!record) {
      await t.rollback();
      return res.status(404).json({ message: 'Administration not found' });
    }

    const usedDoses = (record.doses_used || 0) + (record.doses_wasted || 0);
    const returnAmount = record.report_status === 'pending' ? record.quantity : usedDoses;

    const inventory = await StockInventory.findOne({
      where: { stock_id: record.stock_id, batch_id: record.batch_id },
      transaction: t
    });
    
    if (inventory && returnAmount > 0) {
      inventory.quantity_available += returnAmount;
      await inventory.save({ transaction: t });
    }

    await record.destroy({ transaction: t });
    await t.commit();
    
    res.json({ message: 'Administration deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyVeterinaryEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const records = await AdministrationRecord.findAll({
      where: { email },
      include: [
        { model: Stock },
        { 
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ],
      order: [['date_administered', 'DESC']]
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'No records found for this email.' });
    }

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

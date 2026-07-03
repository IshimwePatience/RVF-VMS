const { AdministrationRecord, StockInventory, Stock, Batch, Vaccine, sequelize } = require('../models');

exports.createAdministration = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { stock_id, batch_id, quantity, veterinary_name, province, district, sector, cell, village } = req.body;

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
    const record = await AdministrationRecord.create({
      stock_id,
      batch_id,
      quantity,
      veterinary_name,
      province,
      district,
      sector,
      cell,
      village
    }, { transaction: t });

    // Deduct inventory
    inventory.quantity_available -= quantity;
    await inventory.save({ transaction: t });

    await t.commit();
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

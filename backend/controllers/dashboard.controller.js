const { AdministrationRecord, StockInventory, Batch, Stock, Vaccine } = require('../models');
const { Sequelize } = require('sequelize');

exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Total stock value
    const inventories = await StockInventory.findAll({
      include: [
        { model: Batch, attributes: ['price_per_dose_rwf'] }
      ]
    });
    
    let totalStockValue = 0;
    inventories.forEach(inv => {
      if (inv.Batch && inv.Batch.price_per_dose_rwf) {
        totalStockValue += inv.quantity_available * inv.Batch.price_per_dose_rwf;
      }
    });

    // 2. Charts: Sectors with high RVF (animals_affected)
    const highRvfSectors = await AdministrationRecord.findAll({
      attributes: [
        'sector',
        [Sequelize.fn('SUM', Sequelize.col('animals_affected')), 'total_affected']
      ],
      group: ['sector'],
      order: [[Sequelize.fn('SUM', Sequelize.col('animals_affected')), 'DESC']],
      limit: 10
    });

    // 3. Charts: Where vaccines used most
    const vaccineUsageSectors = await AdministrationRecord.findAll({
      attributes: [
        'sector',
        [Sequelize.fn('SUM', Sequelize.col('doses_used')), 'total_doses']
      ],
      group: ['sector'],
      order: [[Sequelize.fn('SUM', Sequelize.col('doses_used')), 'DESC']],
      limit: 10
    });

    res.json({
      totalStockValue,
      highRvfSectors,
      vaccineUsageSectors
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

exports.getEndpointDashboard = async (req, res) => {
  try {
    const { stock_id } = req.user;
    if (!stock_id) {
      return res.status(400).json({ message: 'User not associated with a stock point' });
    }

    const reports = await AdministrationRecord.findAll({
      where: { stock_id },
      order: [['date_administered', 'DESC']],
      limit: 20
    });

    res.json({ reports });
  } catch (error) {
    console.error('Error fetching endpoint dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

exports.getInventoryDashboard = async (req, res) => {
  try {
    // Zipline/Operations view - just aggregate supply levels
    const supplies = await StockInventory.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('quantity_available')), 'total_quantity']
      ],
      include: [
        {
          model: Batch,
          attributes: ['vaccine_id'],
          include: [{ model: Vaccine, attributes: ['name'] }]
        }
      ],
      group: ['Batch.vaccine_id', 'Batch->Vaccine.id', 'Batch->Vaccine.name']
    });

    res.json({ supplies });
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

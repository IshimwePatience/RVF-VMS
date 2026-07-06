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

    const usedRaw = await AdministrationRecord.sum('doses_used', { where: { stock_id } });
    const damagedRaw = await AdministrationRecord.sum('doses_wasted', { where: { stock_id } });
    const stockRaw = await StockInventory.sum('quantity_available', { where: { stock_id } });

    res.json({ 
      reports,
      vaccinesUsed: usedRaw || 0,
      vaccinesDamaged: damagedRaw || 0,
      stockLevel: stockRaw || 0
    });
  } catch (error) {
    console.error('Error fetching endpoint dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

exports.getInventoryDashboard = async (req, res) => {
  try {
    // Zipline/Operations view - just aggregate supply levels
    const suppliesRaw = await StockInventory.findAll({
      include: [
        { model: Stock },
        {
          model: Batch,
          include: [{ model: Vaccine }]
        }
      ]
    });

    const supplyMap = {};
    suppliesRaw.forEach(inv => {
      if (inv.Batch && inv.Batch.Vaccine) {
        const vId = inv.Batch.vaccine_id;
        if (!supplyMap[vId]) {
          supplyMap[vId] = {
            vaccine_id: vId,
            vaccine_name: inv.Batch.Vaccine.name,
            total_quantity: 0,
            current_supply: 0,
            distributed_level: 0
          };
        }
        supplyMap[vId].total_quantity += inv.quantity_available;
        
        if (inv.Stock && inv.Stock.is_central) {
          supplyMap[vId].current_supply += inv.quantity_available;
        } else {
          supplyMap[vId].distributed_level += inv.quantity_available;
        }
      }
    });

    res.json({ supplies: Object.values(supplyMap) });
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

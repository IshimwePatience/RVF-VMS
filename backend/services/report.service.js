const { StockInventory, Batch, Stock } = require('../models');

exports.getFinancialReport = async (user) => {
  if (!user.is_central && user.role !== 'Admin') throw new Error('Access denied');

  const inventories = await StockInventory.findAll({
    include: [ { model: Batch }, { model: Stock } ]
  });

  let totalInvestment = 0;
  let currentStockValue = 0;
  
  const allBatches = await Batch.findAll();
  allBatches.forEach(b => {
    totalInvestment += (b.total_doses * b.price_per_dose_rwf);
  });

  inventories.forEach(inv => {
    currentStockValue += (inv.quantity_available * inv.Batch.price_per_dose_rwf);
  });

  return {
    totalInvestment,
    currentStockValue,
    distributedValue: totalInvestment - currentStockValue,
    stockByLocation: inventories.map(inv => ({
      stock: inv.Stock.name,
      batch: inv.Batch.batch_number,
      quantity: inv.quantity_available,
      value_rwf: inv.quantity_available * inv.Batch.price_per_dose_rwf
    }))
  };
};
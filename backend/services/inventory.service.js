const { Batch, StockInventory, ExchangeRate, sequelize, Vaccine, Supplier, Stock } = require('../models');

exports.setExchangeRate = async (data) => {
  return await ExchangeRate.create(data);
};

exports.receiveCentralStock = async (data, user) => {
  if (!user.is_central) throw new Error('Only Central Stock can receive from suppliers.');

  let rate = 1;
  if (data.currency !== 'RWF') {
    const exchange = await ExchangeRate.findOne({ where: { currency: data.currency }, order: [['effective_date', 'DESC']] });
    if (!exchange) throw new Error(`No exchange rate found for ${data.currency}`);
    rate = exchange.rate_to_rwf;
  }

  const total_doses = data.unit_per_container * data.number_of_containers;
  const price_per_dose_rwf = data.original_price_per_dose * rate;

  return await sequelize.transaction(async (t) => {
    const batch = await Batch.create({
      ...data,
      total_doses,
      price_per_dose_rwf
    }, { transaction: t });

    await StockInventory.create({
      stock_id: user.stock_id,
      batch_id: batch.id,
      quantity_available: total_doses
    }, { transaction: t });

    return batch;
  });
};

exports.getInventory = async (user, viewParent) => {
  let query = { stock_id: user.stock_id };
  
  if (viewParent && !user.is_central) {
    const userStock = await Stock.findByPk(user.stock_id);
    if (userStock && userStock.parent_stock_id) {
      query = { stock_id: userStock.parent_stock_id };
    }
  }

  const inventory = await StockInventory.findAll({
    where: query,
    include: [{ 
      model: Batch, 
      include: [
         { model: Vaccine },
         ...(user.is_central ? [{ model: Supplier }] : [])
      ] 
    }]
  });

  return inventory.map(inv => {
    const data = inv.toJSON();
    if (!user.is_central) {
      delete data.Batch.original_price_per_dose;
      delete data.Batch.price_per_dose_rwf;
      delete data.Batch.currency;
    }
    return data;
  });
};
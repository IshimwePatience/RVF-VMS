const { Batch, StockInventory, ExchangeRate, sequelize, Vaccine, Supplier, Stock } = require('../models');

exports.setExchangeRate = async (data) => {
  return await ExchangeRate.create(data);
};

exports.receiveCentralStock = async (data, user) => {
  if (!user.is_central) throw new Error('Only Central Stock can receive from suppliers.');

  let rate = 1;
  if (data.currency !== 'RWF') {
    let exchange = await ExchangeRate.findOne({ where: { currency: data.currency }, order: [['effective_date', 'DESC']] });
    if (!exchange) {
      const defaultRates = { 'USD': 1300, 'EUR': 1400 };
      if (defaultRates[data.currency]) {
        exchange = await ExchangeRate.create({ currency: data.currency, rate_to_rwf: defaultRates[data.currency] });
      } else {
        throw new Error(`No exchange rate found for ${data.currency}`);
      }
    }
    rate = exchange.rate_to_rwf;
  }

  const total_doses = data.unit_per_container * data.number_of_containers;
  const price_per_dose_rwf = data.original_price_per_dose * rate;

  return await sequelize.transaction(async (t) => {
    let batch = await Batch.findOne({
      where: {
        batch_number: data.batch_number,
        vaccine_id: data.vaccine_id
      },
      transaction: t
    });

    if (batch) {
      batch.total_doses += total_doses;
      await batch.save({ transaction: t });

      let inventory = await StockInventory.findOne({
        where: { stock_id: user.stock_id, batch_id: batch.id },
        transaction: t
      });

      if (inventory) {
        inventory.quantity_available += total_doses;
        await inventory.save({ transaction: t });
      } else {
        await StockInventory.create({
          stock_id: user.stock_id,
          batch_id: batch.id,
          quantity_available: total_doses
        }, { transaction: t });
      }
    } else {
      batch = await Batch.create({
        ...data,
        total_doses,
        price_per_dose_rwf
      }, { transaction: t });

      await StockInventory.create({
        stock_id: user.stock_id,
        batch_id: batch.id,
        quantity_available: total_doses
      }, { transaction: t });
    }

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

  const { Transfer } = require('../models');
  const processedInventory = [];

  for (let inv of inventory) {
    const data = inv.toJSON();

    const issued = await Transfer.sum('quantity', {
      where: {
        from_stock_id: query.stock_id,
        batch_id: inv.batch_id
      }
    });
    data.issued_quantity = issued || 0;

    if (!user.is_central) {
      delete data.Batch.original_price_per_dose;
      delete data.Batch.price_per_dose_rwf;
      delete data.Batch.currency;
    }
    processedInventory.push(data);
  }

  return processedInventory;
};
exports.updateInventory = async (id, data, user) => {
  const { StockInventory, Batch } = require('../models');
  if (!user.is_central && user.role !== 'Admin') throw new Error('Not authorized');
  const inventory = await StockInventory.findByPk(id);
  if (!inventory) throw new Error('Inventory not found');
  
  if (data.quantity_available !== undefined) {
    await inventory.update({ quantity_available: data.quantity_available });
  }
  
  if (inventory.batch_id) {
    const batch = await Batch.findByPk(inventory.batch_id);
    if (batch) {
      await batch.update({
        batch_number: data.batch_number || batch.batch_number,
        expiration_date: data.expiration_date || batch.expiration_date,
        vaccine_id: data.vaccine_id || batch.vaccine_id,
        supplier_id: data.supplier_id || batch.supplier_id
      });
    }
  }
  return inventory;
};

exports.deleteInventory = async (id, user) => {
  const { StockInventory, Batch } = require('../models');
  if (!user.is_central && user.role !== 'Admin') throw new Error('Not authorized');
  const inventory = await StockInventory.findByPk(id);
  if (!inventory) throw new Error('Inventory not found');
  const batchId = inventory.batch_id;
  await inventory.destroy();
  if (batchId) {
    await Batch.destroy({ where: { id: batchId } });
  }
  return true;
};

const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'services');
const controllersDir = path.join(__dirname, 'controllers');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir);

const services = {
  'user.service.js': `const { User, Stock } = require('../models');
const bcrypt = require('bcryptjs');

exports.createUser = async (data) => {
  const existingUser = await User.findOne({ where: { username: data.username } });
  if (existingUser) throw new Error('Username already exists');

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(data.password, salt);

  return await User.create({
    username: data.username,
    email: data.email,
    password_hash,
    role: data.role,
    stock_id: data.stock_id,
    must_change_password: true
  });
};

exports.getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password_hash'] },
    include: [{ model: Stock, as: 'Stock' }]
  });
};`,

  'stock.service.js': `const { Stock } = require('../models');

exports.createStock = async (data) => {
  return await Stock.create(data);
};

exports.getStocks = async () => {
  return await Stock.findAll({
    include: [
      { model: Stock, as: 'ParentStock' },
      { model: Stock, as: 'ChildStocks' }
    ]
  });
};`,

  'supplier.service.js': `const { Supplier } = require('../models');

exports.createSupplier = async (data) => {
  return await Supplier.create(data);
};

exports.getSuppliers = async () => {
  return await Supplier.findAll();
};`,

  'vaccine.service.js': `const { Vaccine } = require('../models');

exports.createVaccine = async (data) => {
  return await Vaccine.create(data);
};

exports.getVaccines = async () => {
  return await Vaccine.findAll();
};`,

  'inventory.service.js': `const { Batch, StockInventory, ExchangeRate, sequelize, Vaccine, Supplier, Stock } = require('../models');

exports.setExchangeRate = async (data) => {
  return await ExchangeRate.create(data);
};

exports.receiveCentralStock = async (data, user) => {
  if (!user.is_central) throw new Error('Only Central Stock can receive from suppliers.');

  let rate = 1;
  if (data.currency !== 'RWF') {
    const exchange = await ExchangeRate.findOne({ where: { currency: data.currency }, order: [['effective_date', 'DESC']] });
    if (!exchange) throw new Error(\`No exchange rate found for \${data.currency}\`);
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
};`,

  'request.service.js': `const { Request, Transfer, StockInventory, Stock, sequelize } = require('../models');

exports.createRequest = async (data, user) => {
  const userStock = await Stock.findByPk(user.stock_id);
  if (!userStock.parent_stock_id) throw new Error('Central stock cannot request vaccines');

  return await Request.create({
    requesting_stock_id: user.stock_id,
    parent_stock_id: userStock.parent_stock_id,
    vaccine_id: data.vaccine_id,
    batch_id: data.batch_id,
    requested_quantity: data.requested_quantity,
    requested_by: user.id
  });
};

exports.getRequests = async (user, type) => {
  const where = type === 'incoming' 
    ? { parent_stock_id: user.stock_id } 
    : { requesting_stock_id: user.stock_id };
  return await Request.findAll({ where });
};

exports.approveRequest = async (id, user) => {
  return await sequelize.transaction(async (t) => {
    const request = await Request.findByPk(id, { transaction: t });
    if (!request || request.parent_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
    if (request.status !== 'Pending') throw new Error('Request is already processed');

    const inventory = await StockInventory.findOne({
      where: { stock_id: user.stock_id, batch_id: request.batch_id },
      transaction: t
    });

    if (!inventory || inventory.quantity_available < request.requested_quantity) {
      throw new Error('Insufficient stock available');
    }

    inventory.quantity_available -= request.requested_quantity;
    await inventory.save({ transaction: t });

    request.status = 'Approved';
    request.reviewed_by = user.id;
    await request.save({ transaction: t });

    const transfer = await Transfer.create({
      from_stock_id: user.stock_id,
      to_stock_id: request.requesting_stock_id,
      batch_id: request.batch_id,
      quantity: request.requested_quantity,
      request_id: request.id,
      shipped_by: user.id
    }, { transaction: t });

    return { request, transfer };
  });
};`,

  'transfer.service.js': `const { Transfer, StockInventory, sequelize } = require('../models');

exports.getTransfers = async (user, type) => {
  const where = type === 'incoming' 
    ? { to_stock_id: user.stock_id } 
    : { from_stock_id: user.stock_id };
  return await Transfer.findAll({ where });
};

exports.confirmDelivery = async (id, user) => {
  return await sequelize.transaction(async (t) => {
    const transfer = await Transfer.findByPk(id, { transaction: t });
    if (!transfer || transfer.to_stock_id !== user.stock_id) throw new Error('Unauthorized or not found');
    if (transfer.status !== 'In Transit') throw new Error('Transfer is already processed');

    let inventory = await StockInventory.findOne({
      where: { stock_id: user.stock_id, batch_id: transfer.batch_id },
      transaction: t
    });

    if (inventory) {
      inventory.quantity_available += transfer.quantity;
      await inventory.save({ transaction: t });
    } else {
      await StockInventory.create({
        stock_id: user.stock_id,
        batch_id: transfer.batch_id,
        quantity_available: transfer.quantity
      }, { transaction: t });
    }

    transfer.status = 'Completed';
    transfer.received_by = user.id;
    transfer.received_at = new Date();
    await transfer.save({ transaction: t });

    return transfer;
  });
};`,

  'report.service.js': `const { StockInventory, Batch, Stock } = require('../models');

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
};`
};

for (const [name, content] of Object.entries(services)) {
  fs.writeFileSync(path.join(servicesDir, name), content);
}

// Update Controllers to use Services
const controllers = {
  'user.controller.js': `const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};`,

  'stock.controller.js': `const stockService = require('../services/stock.service');

exports.createStock = async (req, res) => {
  try {
    const stock = await stockService.createStock(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStocks = async (req, res) => {
  try {
    const stocks = await stockService.getStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};`,

  'supplier.controller.js': `const supplierService = require('../services/supplier.service');

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};`,

  'vaccine.controller.js': `const vaccineService = require('../services/vaccine.service');

exports.createVaccine = async (req, res) => {
  try {
    const vaccine = await vaccineService.createVaccine(req.body);
    res.status(201).json(vaccine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await vaccineService.getVaccines();
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};`,

  'inventory.controller.js': `const inventoryService = require('../services/inventory.service');

exports.setExchangeRate = async (req, res) => {
  try {
    const rate = await inventoryService.setExchangeRate(req.body);
    res.status(201).json(rate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.receiveCentralStock = async (req, res) => {
  try {
    const batch = await inventoryService.receiveCentralStock(req.body, req.user);
    res.status(201).json({ message: 'Stock received successfully', batch });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const viewParent = req.query.view_parent === 'true';
    const inventory = await inventoryService.getInventory(req.user, viewParent);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};`,

  'request.controller.js': `const requestService = require('../services/request.service');

exports.createRequest = async (req, res) => {
  try {
    const request = await requestService.createRequest(req.body, req.user);
    if (req.io) req.io.to(\`stock_\${request.parent_stock_id}\`).emit('new_request', request);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await requestService.getRequests(req.user, req.query.type);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const result = await requestService.approveRequest(req.params.id, req.user);
    if (req.io) req.io.to(\`stock_\${result.transfer.to_stock_id}\`).emit('delivery_shipped', result.transfer);
    res.json({ message: 'Request approved and Transfer initiated', transfer: result.transfer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};`,

  'transfer.controller.js': `const transferService = require('../services/transfer.service');

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await transferService.getTransfers(req.user, req.query.type);
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmDelivery = async (req, res) => {
  try {
    const transfer = await transferService.confirmDelivery(req.params.id, req.user);
    if (req.io) req.io.to(\`stock_\${transfer.from_stock_id}\`).emit('delivery_confirmed', transfer);
    res.json({ message: 'Delivery confirmed successfully', transfer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};`,

  'report.controller.js': `const reportService = require('../services/report.service');

exports.getFinancialReport = async (req, res) => {
  try {
    const report = await reportService.getFinancialReport(req.user);
    res.json(report);
  } catch (error) {
    res.status(403).json({ message: error.message || 'Server error' });
  }
};`
};

for (const [name, content] of Object.entries(controllers)) {
  fs.writeFileSync(path.join(controllersDir, name), content);
}

console.log('Services layer created and controllers updated successfully');

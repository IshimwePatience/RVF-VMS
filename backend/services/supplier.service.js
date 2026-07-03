const { Supplier } = require('../models');

exports.createSupplier = async (data) => {
  return await Supplier.create(data);
};

exports.getSuppliers = async () => {
  return await Supplier.findAll();
};
exports.updateSupplier = async (id, data) => {
  const { Supplier } = require('../models');
  const item = await Supplier.findByPk(id);
  if (!item) throw new Error('Supplier not found');
  return await item.update(data);
};
exports.deleteSupplier = async (id) => {
  const { Supplier } = require('../models');
  const item = await Supplier.findByPk(id);
  if (!item) throw new Error('Supplier not found');
  await item.destroy();
  return true;
};

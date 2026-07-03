const { Supplier } = require('../models');

exports.createSupplier = async (data) => {
  return await Supplier.create(data);
};

exports.getSuppliers = async () => {
  return await Supplier.findAll();
};
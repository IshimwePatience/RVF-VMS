const supplierService = require('../services/supplier.service');

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
};
exports.updateSupplier = async (req, res) => {
  try {
    const item = await supplierService.updateSupplier(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
exports.deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

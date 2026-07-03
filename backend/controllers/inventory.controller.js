const inventoryService = require('../services/inventory.service');

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
};
exports.updateInventory = async (req, res) => {
  try {
    const inv = await inventoryService.updateInventory(req.params.id, req.body, req.user);
    res.json(inv);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
exports.deleteInventory = async (req, res) => {
  try {
    await inventoryService.deleteInventory(req.params.id, req.user);
    res.json({ message: 'Inventory deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

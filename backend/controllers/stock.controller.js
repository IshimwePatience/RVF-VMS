const stockService = require('../services/stock.service');

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
    const stocks = await stockService.getStocks(req.user);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateStock = async (req, res) => {
  try {
    const item = await stockService.updateStock(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
exports.deleteStock = async (req, res) => {
  try {
    await stockService.deleteStock(req.params.id);
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

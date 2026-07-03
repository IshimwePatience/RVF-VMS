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
    const stocks = await stockService.getStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const transferService = require('../services/transfer.service');

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
    if (req.io) req.io.to(`stock_${transfer.from_stock_id}`).emit('delivery_confirmed', transfer);
    res.json({ message: 'Delivery confirmed successfully', transfer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
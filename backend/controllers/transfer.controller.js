const transferService = require('../services/transfer.service');
const { notifyStockUsers } = require('../utils/notification');
const { Stock } = require('../models');

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
    const { status } = req.body; // 'Completed' or 'Missing'
    const finalStatus = status === 'Missing' ? 'Missing' : 'Completed';
    const transfer = await transferService.confirmDelivery(req.params.id, req.user, finalStatus);
    
    if (finalStatus === 'Missing') {
      // Notify the sender that the shipment went missing
      const toStock = await Stock.findByPk(req.user.stock_id);
      await notifyStockUsers(
        transfer.from_stock_id, 
        'ALERT', 
        `Alert: Shipment of ${transfer.quantity} doses to ${toStock?.name || 'Endpoint'} has been reported as Missing!`, 
        req.io
      );
    }

    if (req.io) req.io.to(`stock_${transfer.from_stock_id}`).emit('delivery_confirmed', transfer);
    res.json({ message: 'Delivery status updated successfully', transfer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
const requestService = require('../services/request.service');
const { notifyStockUsers } = require('../utils/notification');

exports.createRequest = async (req, res) => {
  try {
    const request = await requestService.createRequest(req.body, req.user);
    if (req.io) req.io.to(`stock_${request.parent_stock_id}`).emit('new_request', request);
    await notifyStockUsers(
      request.parent_stock_id,
      'REQUEST',
      `New vaccine request of ${request.requested_quantity} doses received.`,
      req.io
    );
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
    const result = await requestService.approveRequest(req.params.id, req.user, req.body.approved_quantity, req.body.note);
    if (req.io) req.io.to(`stock_${result.transfer.to_stock_id}`).emit('delivery_shipped', result.transfer);
    await notifyStockUsers(
      result.transfer.to_stock_id,
      'TRANSFER',
      `Your request has been approved and ${result.transfer.quantity} doses are shipped!`,
      req.io
    );
    res.json({ message: 'Request approved and Transfer initiated', transfer: result.transfer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await requestService.rejectRequest(req.params.id, req.user, req.body.note);
    await notifyStockUsers(
      request.requesting_stock_id,
      'ALERT',
      `Your request has been rejected.`,
      req.io
    );
    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    await requestService.deleteRequest(req.params.id, req.user);
    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
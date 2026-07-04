const { Notification, Request, Transfer, Stock, AdministrationRecord } = require('../models');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, user_id: req.user.id }
    });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notification.is_read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const stockId = req.user.stock_id;
    if (!stockId) return res.json({ pendingRequests: 0, unconfirmedDeliveries: 0, unreceivedShipments: 0 });

    const pendingRequests = await Request.count({
      where: { parent_stock_id: stockId, status: 'Pending' }
    });

    const unconfirmedDeliveries = await Transfer.count({
      where: { to_stock_id: stockId, status: 'In Transit' }
    });

    const unreceivedShipments = await Transfer.count({
      where: { from_stock_id: stockId, status: 'In Transit' }
    });

    const pendingFollowUps = await AdministrationRecord.count({
      where: { stock_id: stockId, report_status: 'pending' }
    });

    res.json({
      pendingRequests,
      unconfirmedDeliveries,
      unreceivedShipments,
      pendingFollowUps
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
};

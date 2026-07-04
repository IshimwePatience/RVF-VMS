const { Notification, User } = require('../models');

/**
 * Creates notifications for all users belonging to a specific stock
 * and optionally emits them via socket.
 */
const notifyStockUsers = async (stockId, type, message, io) => {
  try {
    const users = await User.findAll({ where: { stock_id: stockId } });
    
    for (const user of users) {
      const notification = await Notification.create({
        user_id: user.id,
        type,
        message,
        is_read: false
      });
      
      if (io) {
        // Emit specifically to this user's private room
        io.to(`user_${user.id}`).emit('notification', notification);
      }
    }
  } catch (error) {
    console.error('Failed to notify stock users:', error);
  }
};

/**
 * Creates a notification for a specific user.
 */
const notifyUser = async (userId, type, message, io) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type,
      message,
      is_read: false
    });
    
    if (io) {
      io.to(`user_${userId}`).emit('notification', notification);
    }
  } catch (error) {
    console.error('Failed to notify user:', error);
  }
};

module.exports = {
  notifyStockUsers,
  notifyUser
};

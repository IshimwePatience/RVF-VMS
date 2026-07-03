const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Request', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    requesting_stock_id: { type: DataTypes.UUID, allowNull: false },
    parent_stock_id: { type: DataTypes.UUID, allowNull: false },
    vaccine_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    requested_quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },
    requested_by: { type: DataTypes.UUID, allowNull: true },
    reviewed_by: { type: DataTypes.UUID, allowNull: true }
  });
};
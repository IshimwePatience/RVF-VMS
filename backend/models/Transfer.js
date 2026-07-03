const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Transfer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    from_stock_id: { type: DataTypes.UUID, allowNull: false },
    to_stock_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('In Transit', 'Completed', 'Rejected'), defaultValue: 'In Transit' },
    request_id: { type: DataTypes.UUID, allowNull: true },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },
    shipped_by: { type: DataTypes.UUID, allowNull: true },
    received_by: { type: DataTypes.UUID, allowNull: true },
    shipped_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    received_at: { type: DataTypes.DATE, allowNull: true }
  });
};
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('StockInventory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    stock_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    quantity_available: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  });
};
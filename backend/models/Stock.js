const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Stock', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    is_central: { type: DataTypes.BOOLEAN, defaultValue: false },
    parent_stock_id: { type: DataTypes.UUID, allowNull: true }
  });
};
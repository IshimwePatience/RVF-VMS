const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Supplier', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    contact_info: { type: DataTypes.TEXT, allowNull: true }
  });
};
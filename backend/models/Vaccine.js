const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Vaccine', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    product_code: { type: DataTypes.STRING, allowNull: false }
  });
};
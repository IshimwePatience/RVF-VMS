const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('ExchangeRate', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    currency: { type: DataTypes.STRING, allowNull: false },
    rate_to_rwf: { type: DataTypes.FLOAT, allowNull: false },
    effective_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};
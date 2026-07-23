const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RabUser', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    full_names: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    tableName: 'RabUsers',
    timestamps: true
  });
};

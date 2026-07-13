const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Daro', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    full_names: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    district: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'Daros',
    timestamps: true
  });
};

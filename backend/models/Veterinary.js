const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Veterinary', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    stock_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    national_id: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    cell: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: true }
  });
};

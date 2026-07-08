const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Veterinary', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    stock_id: { type: DataTypes.UUID, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    national_id: { type: DataTypes.STRING, allowNull: true },
    province: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    sector: { type: DataTypes.STRING, allowNull: true },
    cell: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: true },
    verification_code: { type: DataTypes.STRING, allowNull: true },
    code_expires_at: { type: DataTypes.DATE, allowNull: true },
    is_self_registered: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
};

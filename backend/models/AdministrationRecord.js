const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AdministrationRecord', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    stock_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    veterinary_name: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    cell: { type: DataTypes.STRING, allowNull: false },
    village: { type: DataTypes.STRING, allowNull: false },
    date_administered: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};

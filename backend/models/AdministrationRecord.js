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
    phone_number: { type: DataTypes.STRING, allowNull: false },
    national_id: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    report_token: { type: DataTypes.UUID, allowNull: true },
    report_status: { type: DataTypes.ENUM('pending', 'submitted'), defaultValue: 'pending' },
    doses_used: { type: DataTypes.INTEGER, allowNull: true },
    doses_wasted: { type: DataTypes.INTEGER, allowNull: true },
    domestic_animals_vaccinated: { type: DataTypes.INTEGER, allowNull: true },
    animals_affected: { type: DataTypes.INTEGER, allowNull: true },
    animals_healed: { type: DataTypes.INTEGER, allowNull: true },
    animals_died: { type: DataTypes.INTEGER, allowNull: true },
    owner_name: { type: DataTypes.STRING, allowNull: true },
    owner_phone: { type: DataTypes.STRING, allowNull: true },
    owner_national_id: { type: DataTypes.STRING, allowNull: true },
    date_administered: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};

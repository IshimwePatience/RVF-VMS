const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Batch', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    batch_number: { type: DataTypes.STRING, allowNull: false },
    vaccine_id: { type: DataTypes.UUID, allowNull: false },
    supplier_id: { type: DataTypes.UUID, allowNull: false },
    arrival_date: { type: DataTypes.DATE, allowNull: false },
    unit_per_container: { type: DataTypes.INTEGER, allowNull: false },
    number_of_containers: { type: DataTypes.INTEGER, allowNull: false },
    total_doses: { type: DataTypes.INTEGER, allowNull: false },
    original_price_per_dose: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    price_per_dose_rwf: { type: DataTypes.FLOAT, allowNull: false },
    expiration_date: { type: DataTypes.DATE, allowNull: true }
  });
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HomeVaccinationRecord', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    veterinary_email: { type: DataTypes.STRING, allowNull: false },
    owner_name: { type: DataTypes.STRING, allowNull: false },
    owner_phone: { type: DataTypes.STRING, allowNull: false },
    owner_national_id: { type: DataTypes.STRING, allowNull: false },
    home_identifier: { type: DataTypes.STRING, allowNull: false },
    animal_type: { type: DataTypes.STRING, allowNull: false },
    animal_identification: { type: DataTypes.STRING, allowNull: false },
    vaccine_name: { type: DataTypes.STRING, allowNull: false },
    batch_number: { type: DataTypes.STRING, allowNull: false },
    dose_given: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    damages: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    date_administered: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};

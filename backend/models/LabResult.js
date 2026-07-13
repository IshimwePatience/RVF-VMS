const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LabResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    farmer_name: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    animal_district_origin: { type: DataTypes.STRING, allowNull: true },
    sector: { type: DataTypes.STRING, allowNull: true },
    cell: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: true },
    specie: { type: DataTypes.STRING, allowNull: true },
    animal_id: { type: DataTypes.STRING, allowNull: true },
    breed: { type: DataTypes.STRING, allowNull: true },
    sex: { type: DataTypes.STRING, allowNull: true },
    age: { type: DataTypes.STRING, allowNull: true },
    vaccination_status: { type: DataTypes.STRING, allowNull: true },
    purpose: { type: DataTypes.STRING, allowNull: true },
    health_status: { type: DataTypes.STRING, allowNull: true },
    rvf_pcr_results: { type: DataTypes.STRING, allowNull: true },
    tested_site: { type: DataTypes.STRING, allowNull: true },
    uploaded_by: { type: DataTypes.UUID, allowNull: true }
  }, {
    timestamps: true
  });
};

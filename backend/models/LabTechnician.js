const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LabTechnician', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    district: { type: DataTypes.STRING, allowNull: true },
    password_hash: { type: DataTypes.STRING, allowNull: true },
    must_change_password: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    can_view_all_results: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
};

const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    must_change_password: { type: DataTypes.BOOLEAN, defaultValue: true },
    stock_id: { type: DataTypes.UUID, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Viewer' },
    settings: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },
    reset_password_requested: { type: DataTypes.BOOLEAN, defaultValue: false },
    reset_password_approved: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
};
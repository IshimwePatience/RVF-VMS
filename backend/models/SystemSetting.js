module.exports = (sequelize, DataTypes) => {
  const SystemSetting = sequelize.define('SystemSetting', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    tableName: 'system_settings',
    timestamps: true
  });
  return SystemSetting;
};

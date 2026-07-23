module.exports = (sequelize, DataTypes) => {
  const SprayingForm = sequelize.define('SprayingForm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    veterinary_phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'SprayingForms',
    timestamps: true
  });

  return SprayingForm;
};

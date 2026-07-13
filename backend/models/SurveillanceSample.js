module.exports = (sequelize, DataTypes) => {
  const SurveillanceSample = sequelize.define('SurveillanceSample', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sn: {
      type: DataTypes.INTEGER
    },
    farmer_name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    district_origin: {
      type: DataTypes.STRING
    },
    sector: {
      type: DataTypes.STRING
    },
    cell: {
      type: DataTypes.STRING
    },
    village: {
      type: DataTypes.STRING
    },
    specie: {
      type: DataTypes.STRING
    },
    animal_id: {
      type: DataTypes.STRING
    },
    breed: {
      type: DataTypes.STRING
    },
    sex: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.STRING
    },
    vaccination_status: {
      type: DataTypes.STRING
    },
    purpose: {
      type: DataTypes.STRING
    },
    health_status: {
      type: DataTypes.STRING
    },
    daro_approval_status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    },
    daro_approved_by: {
      type: DataTypes.STRING
    },
    daro_approval_date: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'SurveillanceSamples',
    timestamps: true
  });

  return SurveillanceSample;
};

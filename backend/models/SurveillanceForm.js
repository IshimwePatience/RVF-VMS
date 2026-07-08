module.exports = (sequelize, DataTypes) => {
  const SurveillanceForm = sequelize.define('SurveillanceForm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    veterinary_email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING
    },
    province: {
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
    stock_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    from_abattoir: {
      type: DataTypes.STRING
    },
    samples_type: {
      type: DataTypes.STRING
    },
    abattoir_details: {
      type: DataTypes.STRING
    },
    collection_date: {
      type: DataTypes.DATEONLY
    },
    test_requested: {
      type: DataTypes.STRING
    },
    submitted_by: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'SurveillanceForms',
    timestamps: true
  });

  return SurveillanceForm;
};

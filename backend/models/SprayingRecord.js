module.exports = (sequelize, DataTypes) => {
  const SprayingRecord = sequelize.define('SprayingRecord', {
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
    district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cell: {
      type: DataTypes.STRING,
      allowNull: true
    },
    village: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amatungo_yose: {
      type: DataTypes.STRING
    },
    izina_ryumuti: {
      type: DataTypes.STRING
    },
    ingano_yose_yemewe: {
      type: DataTypes.FLOAT
    },
    umuti_wakoreshejwe: {
      type: DataTypes.FLOAT
    },
    umuti_usigaye: {
      type: DataTypes.FLOAT
    },
    inka: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ihene: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    intama: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'SprayingRecords',
    timestamps: true
  });

  return SprayingRecord;
};

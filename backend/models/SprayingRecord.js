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
    itariki: {
      type: DataTypes.DATEONLY
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
    ingano_ihari: {
      type: DataTypes.FLOAT
    },
    umuti_wakoreshejwe: {
      type: DataTypes.FLOAT
    },
    umuti_usigaye: {
      type: DataTypes.FLOAT
    },
    ubwoko_bwamatungo: {
      type: DataTypes.STRING
    },
    umubare_wafuherewe: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'SprayingRecords',
    timestamps: true
  });

  return SprayingRecord;
};

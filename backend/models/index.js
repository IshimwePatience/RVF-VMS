const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'Patience123@',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 50,
      min: 0,
      acquire: 120000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

const { Stock, User, Batch, Vaccine, Supplier, StockInventory, Request, Transfer, AdministrationRecord, Notification, Veterinary, HomeVaccinationRecord, LabTechnician } = db;

Stock.belongsTo(Stock, { as: 'ParentStock', foreignKey: 'parent_stock_id' });
Stock.hasMany(Stock, { as: 'ChildStocks', foreignKey: 'parent_stock_id' });

User.belongsTo(Stock, { foreignKey: 'stock_id' });
Stock.hasMany(User, { foreignKey: 'stock_id' });

Batch.belongsTo(Vaccine, { foreignKey: 'vaccine_id' });
Vaccine.hasMany(Batch, { foreignKey: 'vaccine_id' });

Batch.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Batch, { foreignKey: 'supplier_id' });

StockInventory.belongsTo(Stock, { foreignKey: 'stock_id' });
Stock.hasMany(StockInventory, { foreignKey: 'stock_id' });

StockInventory.belongsTo(Batch, { foreignKey: 'batch_id' });
Batch.hasMany(StockInventory, { foreignKey: 'batch_id' });

if (AdministrationRecord) {
  AdministrationRecord.belongsTo(Stock, { foreignKey: 'stock_id' });
  Stock.hasMany(AdministrationRecord, { foreignKey: 'stock_id' });

  AdministrationRecord.belongsTo(Batch, { foreignKey: 'batch_id' });
  Batch.hasMany(AdministrationRecord, { foreignKey: 'batch_id' });
}

if (Notification) {
  User.hasMany(Notification, { foreignKey: 'user_id' });
  Notification.belongsTo(User, { foreignKey: 'user_id' });
}

if (Veterinary) {
  Veterinary.belongsTo(Stock, { foreignKey: 'stock_id' });
  Stock.hasMany(Veterinary, { foreignKey: 'stock_id' });
}

if (db.SurveillanceForm && db.SurveillanceSample) {
  db.SurveillanceForm.hasMany(db.SurveillanceSample, { foreignKey: 'form_id', as: 'samples' });
  db.SurveillanceSample.belongsTo(db.SurveillanceForm, { foreignKey: 'form_id' });
}

Request.belongsTo(Stock, { as: 'RequestingStock', foreignKey: 'requesting_stock_id' });
Request.belongsTo(Stock, { as: 'ParentStock', foreignKey: 'parent_stock_id' });
Request.belongsTo(Vaccine, { foreignKey: 'vaccine_id' });
Request.belongsTo(Batch, { foreignKey: 'batch_id' });
Request.belongsTo(User, { as: 'Requester', foreignKey: 'requested_by' });
Request.belongsTo(User, { as: 'Reviewer', foreignKey: 'reviewed_by' });

Transfer.belongsTo(Stock, { as: 'FromStock', foreignKey: 'from_stock_id' });
Transfer.belongsTo(Stock, { as: 'ToStock', foreignKey: 'to_stock_id' });
Transfer.belongsTo(Batch, { foreignKey: 'batch_id' });
Transfer.belongsTo(Request, { foreignKey: 'request_id' });
Transfer.belongsTo(User, { as: 'Shipper', foreignKey: 'shipped_by' });
Transfer.belongsTo(User, { as: 'Receiver', foreignKey: 'received_by' });

if (db.LabResult && LabTechnician) {
  LabTechnician.hasMany(db.LabResult, { foreignKey: 'uploaded_by', constraints: false });
  db.LabResult.belongsTo(LabTechnician, { foreignKey: 'uploaded_by', as: 'uploader', constraints: false });
}

if (db.SprayingForm && db.SprayingRecord) {
  db.SprayingForm.hasMany(db.SprayingRecord, { foreignKey: 'form_id', as: 'records' });
  db.SprayingRecord.belongsTo(db.SprayingForm, { foreignKey: 'form_id' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

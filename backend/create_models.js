const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');

const models = {
  Stock: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Stock', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    is_central: { type: DataTypes.BOOLEAN, defaultValue: false },
    parent_stock_id: { type: DataTypes.UUID, allowNull: true }
  });
};`,
  User: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    must_change_password: { type: DataTypes.BOOLEAN, defaultValue: true },
    stock_id: { type: DataTypes.UUID, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Viewer' },
    reset_password_requested: { type: DataTypes.BOOLEAN, defaultValue: false },
    reset_password_approved: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
};`,
  Supplier: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Supplier', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    contact_info: { type: DataTypes.TEXT, allowNull: true }
  });
};`,
  Vaccine: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Vaccine', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    product_code: { type: DataTypes.STRING, allowNull: false }
  });
};`,
  ExchangeRate: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('ExchangeRate', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    currency: { type: DataTypes.STRING, allowNull: false },
    rate_to_rwf: { type: DataTypes.FLOAT, allowNull: false },
    effective_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};`,
  Batch: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Batch', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    batch_number: { type: DataTypes.STRING, allowNull: false },
    vaccine_id: { type: DataTypes.UUID, allowNull: false },
    supplier_id: { type: DataTypes.UUID, allowNull: false },
    arrival_date: { type: DataTypes.DATE, allowNull: false },
    unit_per_container: { type: DataTypes.INTEGER, allowNull: false },
    number_of_containers: { type: DataTypes.INTEGER, allowNull: false },
    total_doses: { type: DataTypes.INTEGER, allowNull: false },
    original_price_per_dose: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    price_per_dose_rwf: { type: DataTypes.FLOAT, allowNull: false },
    expiration_date: { type: DataTypes.DATE, allowNull: true }
  });
};`,
  StockInventory: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('StockInventory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    stock_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    quantity_available: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  });
};`,
  Request: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Request', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    requesting_stock_id: { type: DataTypes.UUID, allowNull: false },
    parent_stock_id: { type: DataTypes.UUID, allowNull: false },
    vaccine_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    requested_quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },
    requested_by: { type: DataTypes.UUID, allowNull: true },
    reviewed_by: { type: DataTypes.UUID, allowNull: true }
  });
};`,
  Transfer: `const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Transfer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    from_stock_id: { type: DataTypes.UUID, allowNull: false },
    to_stock_id: { type: DataTypes.UUID, allowNull: false },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('In Transit', 'Completed', 'Rejected'), defaultValue: 'In Transit' },
    request_id: { type: DataTypes.UUID, allowNull: true },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },
    shipped_by: { type: DataTypes.UUID, allowNull: true },
    received_by: { type: DataTypes.UUID, allowNull: true },
    shipped_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    received_at: { type: DataTypes.DATE, allowNull: true }
  });
};`
};

for (const [name, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, name + '.js'), content);
}

const indexContent = `const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize('postgres', 'postgres', 'Patience123@', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

const { Stock, User, Batch, Vaccine, Supplier, StockInventory, Request, Transfer } = db;

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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
`;

fs.writeFileSync(path.join(modelsDir, 'index.js'), indexContent);

console.log('Models separated successfully');

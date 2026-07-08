const { Stock } = require('./backend/models');
const { sequelize } = require('./backend/models');

async function dump() {
  await sequelize.authenticate();
  const stocks = await Stock.findAll();
  console.log(stocks.map(s => ({
    id: s.id,
    name: s.name,
    parent_stock_id: s.parent_stock_id,
    is_central: s.is_central,
    district: s.district,
    sector: s.sector
  })));
  process.exit();
}
dump();

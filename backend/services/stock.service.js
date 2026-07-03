const { Stock } = require('../models');

exports.createStock = async (data) => {
  if (data.parent_stock_id === '') data.parent_stock_id = null;
  return await Stock.create(data);
};

exports.getStocks = async () => {
  return await Stock.findAll({
    include: [
      { model: Stock, as: 'ParentStock' },
      { model: Stock, as: 'ChildStocks' }
    ]
  });
};
exports.updateStock = async (id, data) => {
  const { Stock } = require('../models');
  const item = await Stock.findByPk(id);
  if (!item) throw new Error('Stock not found');
  if (data.parent_stock_id === '') data.parent_stock_id = null;
  return await item.update(data);
};
exports.deleteStock = async (id) => {
  const { Stock } = require('../models');
  const item = await Stock.findByPk(id);
  if (!item) throw new Error('Stock not found');
  await item.destroy();
  return true;
};

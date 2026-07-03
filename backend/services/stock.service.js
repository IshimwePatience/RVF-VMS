const { Stock } = require('../models');

exports.createStock = async (data) => {
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
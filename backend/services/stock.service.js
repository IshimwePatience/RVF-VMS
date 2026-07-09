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
  const { Stock, User, StockInventory, AdministrationRecord, Veterinary, Request, Transfer, SurveillanceForm, HomeVaccinationRecord } = require('../models');
  const item = await Stock.findByPk(id);
  if (!item) throw new Error('Stock not found');
  
  if (item.is_central && item.name === 'National Central Stock') {
    throw new Error('Cannot delete the National Central Stock');
  }

  // Nullify child stocks
  await Stock.update({ parent_stock_id: null }, { where: { parent_stock_id: id } });
  
  // Nullify users
  if (User) await User.update({ stock_id: null }, { where: { stock_id: id } });
  
  // Nullify veterinaries
  if (Veterinary) await Veterinary.update({ stock_id: null }, { where: { stock_id: id } });
  
  // Delete stock inventory
  if (StockInventory) await StockInventory.destroy({ where: { stock_id: id } });
  
  // Nullify administration records
  if (AdministrationRecord) await AdministrationRecord.update({ stock_id: null }, { where: { stock_id: id } });

  // Nullify surveillance forms and home vaccination records
  if (SurveillanceForm) await SurveillanceForm.update({ stock_id: null }, { where: { stock_id: id } });
  if (HomeVaccinationRecord) await HomeVaccinationRecord.update({ stock_id: null }, { where: { stock_id: id } });

  // Delete requests and transfers where this stock is the primary subject
  if (Request) {
    await Request.destroy({ where: { requesting_stock_id: id } });
    await Request.update({ parent_stock_id: null }, { where: { parent_stock_id: id } });
  }
  if (Transfer) {
    await Transfer.destroy({ where: { from_stock_id: id } });
    await Transfer.destroy({ where: { to_stock_id: id } });
  }

  await item.destroy();
  return true;
};

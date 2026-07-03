const { Vaccine } = require('../models');

exports.createVaccine = async (data) => {
  return await Vaccine.create(data);
};

exports.getVaccines = async () => {
  return await Vaccine.findAll();
};
exports.updateVaccine = async (id, data) => {
  const { Vaccine } = require('../models');
  const item = await Vaccine.findByPk(id);
  if (!item) throw new Error('Vaccine not found');
  return await item.update(data);
};
exports.deleteVaccine = async (id) => {
  const { Vaccine } = require('../models');
  const item = await Vaccine.findByPk(id);
  if (!item) throw new Error('Vaccine not found');
  await item.destroy();
  return true;
};

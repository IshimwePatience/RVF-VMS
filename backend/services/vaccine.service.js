const { Vaccine } = require('../models');

exports.createVaccine = async (data) => {
  return await Vaccine.create(data);
};

exports.getVaccines = async () => {
  return await Vaccine.findAll();
};
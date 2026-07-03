const vaccineService = require('../services/vaccine.service');

exports.createVaccine = async (req, res) => {
  try {
    const vaccine = await vaccineService.createVaccine(req.body);
    res.status(201).json(vaccine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await vaccineService.getVaccines();
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
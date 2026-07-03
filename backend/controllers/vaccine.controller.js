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
exports.updateVaccine = async (req, res) => {
  try {
    const item = await vaccineService.updateVaccine(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
exports.deleteVaccine = async (req, res) => {
  try {
    await vaccineService.deleteVaccine(req.params.id);
    res.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

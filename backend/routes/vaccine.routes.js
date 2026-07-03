const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccine.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireCentralStock, vaccineController.createVaccine);
router.get('/', authenticate, vaccineController.getVaccines);

module.exports = router;
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/exchange-rates', authenticate, settingsController.getExchangeRates);
router.put('/exchange-rates/:currency', authenticate, requireAdmin, settingsController.updateExchangeRate);

module.exports = router;

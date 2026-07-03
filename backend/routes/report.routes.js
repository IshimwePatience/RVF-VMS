const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.get('/financial', authenticate, requireCentralStock, reportController.getFinancialReport);

module.exports = router;
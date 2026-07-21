const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.get('/financial', authenticate, requireCentralStock, reportController.getFinancialReport);

const reportsController = require('../controllers/reports.controller');
router.get('/overview', reportsController.getGlobalOverview);

module.exports = router;
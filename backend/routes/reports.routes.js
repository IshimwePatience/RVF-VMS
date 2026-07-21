const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

router.get('/overview', reportsController.getGlobalOverview);

module.exports = router;

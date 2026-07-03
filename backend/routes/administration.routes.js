const express = require('express');
const router = express.Router();
const adminController = require('../controllers/administration.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, adminController.createAdministration);
router.get('/', authenticate, adminController.getAdministrations);

router.get('/report/:token', adminController.getReportDetails);
router.post('/report/:token', adminController.submitReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/admin', authenticate, dashboardController.getAdminDashboard);
router.get('/endpoint', authenticate, dashboardController.getEndpointDashboard);
router.get('/inventory', authenticate, dashboardController.getInventoryDashboard);

module.exports = router;

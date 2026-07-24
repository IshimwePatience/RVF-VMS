const express = require('express');
const router = express.Router();
const surveillanceController = require('../controllers/surveillance.controller');

router.get('/migrate-tracking-ids', surveillanceController.migrateTrackingIds);
router.post('/', surveillanceController.submitForm);
router.get('/', surveillanceController.getForms);
router.patch('/samples/:id/approve', surveillanceController.approveSample);

// Admin only sample management
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
router.put('/samples/:id', authenticate, requireAdmin, surveillanceController.updateSample);
router.delete('/samples/:id', authenticate, requireAdmin, surveillanceController.deleteSample);

module.exports = router;

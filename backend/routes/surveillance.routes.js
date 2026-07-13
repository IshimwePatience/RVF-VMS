const express = require('express');
const router = express.Router();
const surveillanceController = require('../controllers/surveillance.controller');

router.post('/', surveillanceController.submitForm);
router.get('/', surveillanceController.getForms);
router.patch('/samples/:id/approve', surveillanceController.approveSample);

module.exports = router;

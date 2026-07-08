const express = require('express');
const router = express.Router();
const surveillanceController = require('../controllers/surveillance.controller');

router.post('/', surveillanceController.submitForm);
router.get('/', surveillanceController.getForms);

module.exports = router;

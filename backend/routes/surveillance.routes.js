const express = require('express');
const router = express.Router();
const surveillanceController = require('../controllers/surveillance.controller');

router.post('/', surveillanceController.submitForm);

module.exports = router;

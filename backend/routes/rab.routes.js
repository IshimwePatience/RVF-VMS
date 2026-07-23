const express = require('express');
const router = express.Router();
const rabController = require('../controllers/rab.controller');

router.post('/login', rabController.login);

module.exports = router;

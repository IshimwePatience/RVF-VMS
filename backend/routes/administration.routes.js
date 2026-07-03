const express = require('express');
const router = express.Router();
const adminController = require('../controllers/administration.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, adminController.createAdministration);
router.get('/', authenticate, adminController.getAdministrations);

module.exports = router;

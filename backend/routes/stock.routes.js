const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireAdmin, stockController.createStock);
router.get('/', authenticate, stockController.getStocks);

module.exports = router;
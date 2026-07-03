const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/receive', authenticate, requireCentralStock, inventoryController.receiveCentralStock);
router.get('/', authenticate, inventoryController.getInventory);
router.post('/exchange-rate', authenticate, requireCentralStock, inventoryController.setExchangeRate);

router.put('/:id', authenticate, requireCentralStock, inventoryController.updateInventory);
router.delete('/:id', authenticate, requireCentralStock, inventoryController.deleteInventory);

module.exports = router;

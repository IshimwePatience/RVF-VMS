const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireCentralStock, supplierController.createSupplier);
router.get('/', authenticate, requireCentralStock, supplierController.getSuppliers);

module.exports = router;
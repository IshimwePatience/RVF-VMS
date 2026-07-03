const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate, requireCentralStock } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireCentralStock, supplierController.createSupplier);
router.get('/', authenticate, requireCentralStock, supplierController.getSuppliers);


router.put('/:id', authenticate, requireCentralStock, supplierController.updateSupplier);
router.delete('/:id', authenticate, requireCentralStock, supplierController.deleteSupplier);

module.exports = router;

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, transferController.getTransfers);
router.post('/:id/confirm', authenticate, transferController.confirmDelivery);

module.exports = router;
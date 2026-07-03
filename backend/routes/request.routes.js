const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, requestController.createRequest);
router.get('/', authenticate, requestController.getRequests);
router.post('/:id/approve', authenticate, requestController.approveRequest);

module.exports = router;
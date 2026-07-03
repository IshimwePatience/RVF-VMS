const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, requestController.createRequest);
router.get('/', authenticate, requestController.getRequests);
router.post('/:id/approve', authenticate, requestController.approveRequest);
router.post('/:id/reject', authenticate, requestController.rejectRequest);
router.delete('/:id', authenticate, requestController.deleteRequest);

module.exports = router;
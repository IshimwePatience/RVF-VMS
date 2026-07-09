const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResults.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, labResultsController.uploadResults);
router.get('/', authenticate, labResultsController.getResults);

module.exports = router;

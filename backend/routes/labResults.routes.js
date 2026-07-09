const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResults.controller');
const auth = require('../middleware/auth');

router.post('/', auth, labResultsController.uploadResults);
router.get('/', auth, labResultsController.getResults);

module.exports = router;

const express = require('express');
const router = express.Router();
const sprayingController = require('../controllers/spraying.controller');

router.post('/', sprayingController.createReport);
router.get('/', sprayingController.getReports);
router.put('/:id', sprayingController.updateReport);
router.delete('/:id', sprayingController.deleteReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const veterinaryPortalController = require('../controllers/veterinaryPortal.controller');

router.get('/overview', veterinaryPortalController.getOverview);
router.get('/available-vaccines', veterinaryPortalController.getAvailableVaccines);
router.post('/vaccination', veterinaryPortalController.recordVaccination);

module.exports = router;

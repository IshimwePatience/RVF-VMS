const express = require('express');
const router = express.Router();
const veterinaryController = require('../controllers/veterinary.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, veterinaryController.getVeterinaries);
router.post('/', authenticate, veterinaryController.createVeterinary);
router.put('/:id', authenticate, veterinaryController.updateVeterinary);
router.delete('/:id', authenticate, veterinaryController.deleteVeterinary);

module.exports = router;

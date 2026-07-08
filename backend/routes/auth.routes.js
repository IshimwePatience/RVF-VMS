const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/request-reset', authController.requestPasswordReset);
router.put('/settings', authenticate, authController.updateSettings);

// Veterinary Passwordless Auth
router.post('/vet/login', authController.vetLogin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getMyNotifications, markAsRead, getReminders } = require('../controllers/notification.controller');

router.use(authenticate);

router.get('/', getMyNotifications);
router.get('/reminders', getReminders);
router.put('/:id/read', markAsRead);

module.exports = router;

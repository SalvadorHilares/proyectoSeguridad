const { Router } = require('express');
const router = Router();
const authMiddleware = require('../utils/auth.middleware');

const { getNotifications, getNotificationsByUser } = require('../controllers/Notification.controllers');

router.get('/', getNotifications);
router.get('/users', authMiddleware, getNotificationsByUser);

module.exports = router;
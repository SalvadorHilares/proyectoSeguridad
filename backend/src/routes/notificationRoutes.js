const { Router } = require('express');
const router = Router();
const authMiddleware = require('../utils/auth.middleware');

const { getNotifications, getNotificationsByUser, getUsersByNotification, getUsersByGroup } = require('../controllers/Notification.controllers');

router.get('/', getNotifications);
router.get('/users/:notificationId', authMiddleware, getUsersByNotification);
router.get('/users', authMiddleware, getNotificationsByUser);
router.get('/groups/:groupId', authMiddleware, getUsersByGroup);

module.exports = router;
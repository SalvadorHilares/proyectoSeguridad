const { Router } = require('express');
const router = Router();

const { getNotifications, getNotificationsByUser } = require('../controllers/Notification.controllers');

router.get('/', getNotifications);
router.get('/:userId', getNotificationsByUser);

module.exports = router;
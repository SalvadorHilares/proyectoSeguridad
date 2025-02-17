const { Router } = require('express');
const router = Router();

const userRoutes = require('./userRoutes.js');
const groupRoutes = require('./groupRoutes.js');
const notificationRoutes = require('./notificationRoutes.js');
const messageRoutes = require('./messageRoutes.js');

router.use('/user', userRoutes);
router.use('/group', groupRoutes);
router.use('/notification', notificationRoutes);
router.use('/message', messageRoutes);

module.exports = router;
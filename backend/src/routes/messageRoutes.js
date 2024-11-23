const { Router } = require('express');
const router = Router();
const authMiddleware = require('../utils/auth.middleware');

const { getMessagesByUser } = require('../controllers/Message.controllers');

router.get('/', authMiddleware, getMessagesByUser);

module.exports = router;
const { Router } = require('express');
const router = Router();
const authMiddleware = require('../utils/auth.middleware');

const { login, register, sendEmailToGroup, receiveEmailFromGroup, getUsers } = require('../controllers/User.controllers');

router.get('/', getUsers);
router.post('/register', register);
router.post('/login', login);
router.post('/sendEmailToGroup', authMiddleware, sendEmailToGroup);
router.post('/receiveEmailFromGroup', authMiddleware, receiveEmailFromGroup);

module.exports = router;
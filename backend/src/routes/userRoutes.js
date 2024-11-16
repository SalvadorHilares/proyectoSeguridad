const { Router } = require('express');
const router = Router();

const { login, register, sendEmailToGroup, receiveEmailFromGroup } = require('../controllers/User.controllers');

router.post('/register', register);
router.post('/login', login);
router.post('/sendEmailToGroup', sendEmailToGroup);
router.post('/receiveEmailFromGroup', receiveEmailFromGroup);

module.exports = router;
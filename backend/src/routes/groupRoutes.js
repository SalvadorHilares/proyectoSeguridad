const { Router } = require('express');
const router = Router();
const authMiddleware = require('../utils/auth.middleware');

const { sendKeyGroup, desecryptKeyGroup, getGroupsByUser } = require('../controllers/Group.controllers');

router.post('/sendKeyGroup', authMiddleware, sendKeyGroup);
router.post('/desecryptKeyGroup', authMiddleware, desecryptKeyGroup);
router.get('/getGroupsByUser', authMiddleware, getGroupsByUser);

module.exports = router;
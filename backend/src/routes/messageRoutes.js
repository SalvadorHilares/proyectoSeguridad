const { Router } = require('express');
const router = Router();

const { getMessages, getMessagesByUser } = require('../controllers/Message.controllers');

router.get('/', getMessages);
router.get('/:userId', getMessagesByUser);

module.exports = router;
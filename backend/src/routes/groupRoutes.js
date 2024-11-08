const { Router } = require('express');
const router = Router();

const { sendKeyGroup } = require('../controllers/Group.controllers');

router.post('/sendKeyGroup', sendKeyGroup);

module.exports = router;
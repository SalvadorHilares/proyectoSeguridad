const { Router } = require('express');
const router = Router();

const { sendKeyGroup, desecryptKeyGroup } = require('../controllers/Group.controllers');

router.post('/sendKeyGroup', sendKeyGroup);
router.post('/desecryptKeyGroup:notificationId', desecryptKeyGroup);

module.exports = router;
const { Router } = require('express');
const router = Router();

const { sendKeyGroup, desecryptKeyGroup, getGroupsByUser } = require('../controllers/Group.controllers');

router.post('/sendKeyGroup', sendKeyGroup);
router.post('/desecryptKeyGroup', desecryptKeyGroup);
router.get('/getGroupsByUser/:userId', getGroupsByUser);

module.exports = router;
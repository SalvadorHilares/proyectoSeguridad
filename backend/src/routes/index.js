const { Router } = require('express');
const router = Router();

const userRoutes = require('./userRoutes.js');
const groupRoutes = require('./groupRoutes.js');

router.use('/user', userRoutes);
router.use('/group', groupRoutes);

module.exports = router;
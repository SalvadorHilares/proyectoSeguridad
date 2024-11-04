const { Router } = require('express');
const router = Router();

const userRoutes = require('./userRoutes');
const groupRoutes = require('./groupRoutes');

router.use('/user', userRoutes);
router.use('/group', groupRoutes);

module.exports = router;
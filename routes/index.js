const express = require('express');
const router = express.Router();

const userRoutes = require('./user-routes');
const courseRoutes = require('./course-routes');

router.use('/users', userRoutes);
router.use('/courses', courseRoutes);

module.exports = router;

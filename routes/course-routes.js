'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models/user');
const { Course } = require('../models/course');
const { authenticateUser } = require('../middleware/auth-user');

//construct a router instance
const router = express.Router();








module.exports = router;
'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');
// console.log('User :', User);
const { authenticateUser } = require('../middleware/auth-user');

//construct a router instance
const router = express.Router();


// Route that returns a list of authenticated users 
router.get('/', authenticateUser, asyncHandler((req, res) => {
    //users that have passed the authentication process are assigned to req as a property
    const user = req.currentUser;
    res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

//Route that  creates a new user 
router.post('/', authenticateUser, asyncHandler(async (req, res) => {

    try {
        await User.create(req.body);
        res.status(201).json({ 'message': 'Account created successfully' });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;
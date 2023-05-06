'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');
// console.log('User :', User);
const { authenticateUser } = require('../middleware/auth-user');

//construct a router instance
const router = express.Router();


// Route that returns a list of authenticated users
/**
 * Create a GET route that will return all properties and values for the currently authenticated User 
 * set the status code to 200
 */
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    //users that have passed the authentication process are assigned to req as a property
    const user = await req.currentUser;
    res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

/**
 *  Create a POST route that will create a new user, set the Location header to "/",
 * Return a 201 HTTP status code and no content.
 */
//Route that  creates a new user 
router.post('/', asyncHandler(async (req, res) => {

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
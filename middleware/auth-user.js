'use strict'

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');



//Middleware to authenticate the request using Basic authentication
/**
 * Assign the header authorisation to credential variable
 * If statement - if credential is truty, then find the users where the credential email address is equal to the database email.
 * If statement - if user exists, compare the hashed password from the database with the user's credential password.
 * If statement - if password matches, store the user's detail to the req object as currentUser property and log a authorisation successful message
 * Else log authorisation unsuccessful message 
 * Else log credentials didn't match message
 * Else log authorisation header not found 
 */
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);
    // console.log('credentials :', credentials);


    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });


        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            if (authenticated) {
                console.log(`Authentication successful for the name: ${user.firstName}`);

                //stores the users on the request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for the name ${credentials.name}`;
            }
        } else {
            message = `User cannot be found for ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }


    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
}

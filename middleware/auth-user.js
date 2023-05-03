'use strict'

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');
console.log('User :', User);



//Middleware to authenticate the request using Basic authentication
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { username: credentials.name } });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.confirmedPassword);
            if (authenticated) {
                console.log(`Authentication successful for the username: ${user.username}`);

                //stores the users on the request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for the username ${user.username}`;
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

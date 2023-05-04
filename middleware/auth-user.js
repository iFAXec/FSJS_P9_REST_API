'use strict'

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');



//Middleware to authenticate the request using Basic authentication
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        // console.log('user :', user);

        if (user) {
            const authenticated = bcrypt.compareSync(credentials.password, user.password);
            // console.log('authenticated :', authenticated);

            // console.log('credentials.password:', credentials.password);
            // console.log('credentials:', credentials);
            // console.log('user.password:', user.password);
            // console.log('password :', password);

            if (authenticated) {
                console.log(`Authentication successful for the emailAddress: ${user.emailAddress}`);

                //stores the users on the request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for the emailAddress ${user.emailAddress}`;
            }
        } else {
            message = `User cannot be found for ${credentials.emailAddress}`;
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

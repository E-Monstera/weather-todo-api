const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
// Require the dotenv file for the secret
require('dotenv').config();


//Method to signup a user
exports.signup_user = [
    // Validate and sanitize user input
    body('username', 'Username is required').escape().trim().isLength({ min: 1 }).withMessage('Min length is 4 characters'),
    body('email', 'Email is required').escape().trim().isLength({ min: 3 }).withMessage('Min length is 3 characters'),
    body('password', 'Password is required').isLength({ min: 8 }).escape().trim().withMessage('Minimum password length is 8 characters'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There were errors during validation, return 
            res.status(400).json({ errArr: errors.array() });
        } else {
            // There were no users, hash the password and save the user
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                let userDetail = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                };

                let user = new User(userDetail);
                user.save((err, result) => {
                    if (err === null) {
                        res.status(200).json({
                            'Message': 'user Created', user: {
                                username: req.body.username,
                                email: req.body.email
                            }
                        })
                    }
                    else if (err.keyValue.email) {
                        res.status(400).json({ message: "User with that email already exists" })
                    } else if (err) { return next(err); }
                })
            })
        }
    }
]

exports.login_user = function (req, res, next) {
    // email, rather than username is used for authentication
    // Destructure email and password
    let { email, password } = req.body;

    //Check if user exists in the database
    User.findOne({ email})
        .then(user => {
            if (!user) {
                //User doesn't exist, return error message
                return res.status(400).json({ message: 'Incorrect email' });
            } else {
                // User exists, check that their password matches
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        //Authentication passed, create the token and return it to the client
                        const opts = {};
                        opts.expiresIn = '2 days';
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign({ user }, secret, opts);

                        // User data to send back to client - Removed password from object
                        const theUser = {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                        }
                        if (user.location) {
                            theUser.location = user.location;
                        }
                        // console.log(theUser)
                        // Return success to client
                        res.status(200).json({
                            message: 'Authentication Successful',
                            user: theUser,
                            token
                        })

                    } else {
                        // Password check failed, return error message
                        return res.status(400).json({ message: 'Incorrect Password' })
                    }
                })
            }
        })
}

exports.auth_user = function (req, res, next) {
    console.log('in auth_user')
    return res.status(200).json({ user: req.user });
}
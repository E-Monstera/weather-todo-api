// This middleware is ran whenever we need to authenticate a user to access a route

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('../models/User');

// Require the dotenv file for the secret
require('dotenv').config();

// Set the options object for the JwtStrategy
let opts = {}
opts.secretOrKey = process.env.JWT_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// Create the new JwtStrategy to check if the user has an active token for the db
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload.user._id)
    .exec(function (err, returnedUser) {
        console.log('in auth user')
        console.log(returnedUser)
        const user = {
            _id: returnedUser._id,
            username: returnedUser.username,
            email: returnedUser.email,
            location: returnedUser.location
        }

        // If there is an error, return the error
        if (err) {
            return done(err, false);
        }
        // If token passed authentication, let the routeController handle it
        if (user) {
            return done(null, user);
        }
            // User failed authentication, return a 401: unauthorized status
        else {
            return done(null, false);
        }
    });
}));
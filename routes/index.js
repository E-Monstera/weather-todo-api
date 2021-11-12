var express = require('express');
var router = express.Router();
require('dotenv').config();
const passport = require('passport')
const userController = require('../controllers/userController')
const apiController = require('../controllers/apiController');


//Route to grab the weather from an external API
router.get('/weather/:city', apiController.get_weather);

//-------------------------------------------------------------------------------------
// Routes for managing users

//Route to signup a user
router.post('/', userController.signup_user)

// Route to login user
router.post('/session', userController.login_user);

// Route authenticates user upon returning to site
router.get('/session', passport.authenticate('jwt', { session: false }), userController.auth_user);

//Route to update a users location
router.put('/user/location', passport.authenticate('jwt', { session: false }), userController.update_user);

//Route to update a users preferred units
router.put('/user/units', passport.authenticate('jwt', { session: false }), userController.put_user_units);

module.exports = router;

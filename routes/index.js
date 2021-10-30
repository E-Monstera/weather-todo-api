const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
require('dotenv').config();
const passport = require('passport')
const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({ message: 'WORKED' });
});

router.get('/weather/:city', async(req, res, next) => {
  try {
    // Try grabbing the latitude and longitude from the MapQuest API
    // If successful, then grab the water from the openweather API
    const response = await axios.get(`${process.env.LOCATION_API}&location=${req.params.city}`)
    let lat = response.data.results[0].locations[0].displayLatLng.lat;
    let lng = response.data.results[0].locations[0].displayLatLng.lng;
    const weather = await axios.get(`${process.env.WEATHER_URL}lat=${lat}&lon=${lng}&units=metric&exclude=minutely${process.env.WEATHER_API}`)
    res.status(200).json({weather: weather.data})
  } catch(err) {
    console.log('error')
    //Something went wrong
    res.status(400).json({message: 'Incorrect input'})
    next(err)
}
})

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

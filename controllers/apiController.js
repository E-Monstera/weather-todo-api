const { default: axios } = require('axios');

exports.get_weather = async function(req, res, next) {
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
}


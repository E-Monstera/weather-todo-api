# Weather-ToDo: The Weather Planner

The Weather Planner is a responsive site that allows users to create their plans with the weather in mind. The React and SASS built frontend display the current, daily, and hourly weather to the user who can then add items to their planner with the weather in mind. On the backend, nodeJs manages the database and works with the OpenWeather API to manage and deliver data.

This application is the API for The Weather Planner

## Demo
A live demo is available at: [The Weather Planner](http://planner.elisabethoconnor.com)
![Screenshot of Demo](/assets/planner.png)

## Features
- Receive the current, daily, and hourly weather for any user-inputted location
- Add 'todo' items to the planner with the option of adding these items to a specific project
- Add 'notes' such as shopping lists
- Add/delete/edit projects, add/delete/edit items, and add/delete/edit notes

## How to Use
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:

```
#clone this repository
$ git clone https://github.com/E-Monstera/weather-todo-api.git

#Go into the respository
$ cd weather-todo-api

#Install dependencies
$ npm install

#run the app
$ npm run
```

## Configuration
In order to properly run this application, you will your own environmental variables.
The required variables are as follows:
 - DB_URL: For your database
 - JWT_SECRET: For your JWT key
 - LOCATION_API - MapQuest API
 - WEATHER_URL - OpenWeather API url
 - WEATHER_API - OpenWeather API key
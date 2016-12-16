var express = require('express');
var app = express();
var api = require('./api/api');
var config = require('./config/config');
var mongoose = require('mongoose');  
var morgan = require('morgan');
var bodyParser = require('body-parser');

var userRouter = require('./api/user/userRoutes');
// connect to mongoDB database 
mongoose.connect(config.db.url);
//Set - up global middleware
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());


//In a large application, 
//things could easily get out of control 
//if we keep adding code to a single 
//JavaScript file (server.js).
// So  move the routes-related code 
//into  api module .


app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.use('/users', userRouter)
app.use('/api/', api);

// API endpoints such as below has been moved to user Router within api module
//app.get('/user', function(req, res) {
   // res.send([{username:'wine1'}, {username:'wine2'}]);
//});
 
 
// export the app for testing
module.exports = app;

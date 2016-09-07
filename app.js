require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');

var uglifyJs = require("uglify-js");
var fs = require('fs');

//var routes = require('./app_server/routes/index');//app_server1
var routesApi = require('./app_api/routes/index');
//var users = require('./app_server/routes/users');

var app = express();

// view engine setup   app_server2
//app.set('views', path.join(__dirname, 'app_server', 'views'));
//app.set('view engine', 'jade');

//use uglifyjs ganarate wifidot.min.js,reduce the number of js file.
var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/about/about.controller.js',
  'app_client/locationDetail/locationDetail.controller.js',
  'app_client/reviewModal/reviewModal.controller.js',
  'app_client/auth/register/register.controller.js',
  'app_client/auth/login/login.controller.js',
  'app_client/common/services/geolocation.service.js',
  'app_client/common/services/wifidotData.service.js',
  'app_client/common/services/authentication.service.js',
  'app_client/common/filters/formatDistance.filter.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/ratingStars/ratingStars.directive.js',
  'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });
//console.log(uglified.code);

fs.writeFile('public/angular/wifidot.min.js', uglified.code, function (err) {
  if(err) {
	  console.log(err);
  } else {
		console.log("Script generated and saved:", 'wifidot.min.js');
  }
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use(passport.initialize());

//app.use('/', routes);//app_server3
app.use('/api', routesApi);
//app.use('/users', users);
//用下面的函数替换app.use('/', routes)，实现SPA
app.use(function (req, res) {
	res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
//catch unauthorised errors
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message
			, error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message, 
		error: {}
	});
});


module.exports = app;
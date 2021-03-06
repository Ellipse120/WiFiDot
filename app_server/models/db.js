var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/WiFiDot';
mongoose.connect(dbURI);

//Connection events
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(){
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

//capture app termination / restart events
//to be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
//for nodemon restarts
process.once('SIGUSR2', function(){
  gracefulShutdown('nodemon restarts', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});
//for app termination
process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});

require('./locations');


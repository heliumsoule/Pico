
// DEPENDENCIES
// ==============================================

var express = require('express');
var AWS = require('aws-sdk');
var config = require('./config.js')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// CONFIGURATION
// ==============================================

// BodyParser for POST requests
app.use('/', express.static('public'));

// API
var apiRouter = require('./app/routes/api.js');
app.use('/api', apiRouter);

// Setting up  S3
var s3 = new AWS.S3(); 

io.on('connection', function(socket) {
  console.log("SOCKET.IO CONNECTION!");
});

// START SERVER
// ==============================================
server.listen(config.port);
console.log('Serving beer on port ' + config.port);

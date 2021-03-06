
// DEPENDENCIES
// ==============================================

var express = require('express');
var config = require('./config.js')
var app = express();

var server = require('http').createServer(app);

var config = require('./config.js')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

module.exports.io = io;


// CONFIGURATION
// ==============================================

// BodyParser for POST requests
app.use('/', express.static('public'));

// API
var apiRouter = require('./app/routes/api.js');
app.use('/api', apiRouter);


// START SERVER
// ==============================================
server.listen(config.port);
console.log('Serving beer on port ' + config.port);

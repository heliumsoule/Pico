
// DEPENDENCIES
// ==============================================

var express = require('express');
var config = require('./config.js')
var app = express();
var server = require('http').createServer(app);

// CONFIGURATION
// ==============================================

// BodyParser for POST requests
app.use('/', express.static('public'));

// API
var apiRouter = require('./app/routes/api.js');
app.use('/api', apiRouter);

// Setting up  S3



// START SERVER
// ==============================================
server.listen(config.port);
console.log('Serving beer on port ' + config.port);

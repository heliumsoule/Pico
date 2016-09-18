
// DEPENDENCIES
// ==============================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var config = require('./config.js')
var mongoose = require('mongoose');




// CONFIGURATION
// ==============================================
// Connect to DB
var db = config.database;
mongoose.connect(db);


// BodyParser for POST requests
app.use('/', express.static('public'));

// API
var apiRouter = require('./app/routes/api.js');
app.use('/api', apiRouter);



// START SERVER
// ==============================================
server.listen(config.port);
console.log('Serving beer on port ' + config.port);

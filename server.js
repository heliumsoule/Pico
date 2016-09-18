
// DEPENDENCIES
// ==============================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var config = require('./config.js')

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var auth = require('./app/auth');
var headers = require('./app/headers');

var client = redis.createClient();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(headers);

app.use(cookieParser('secret'));
app.use(session({secret: 'secret', resave: true, saveUninitialized: true, store: new redisStore({host: 'localhost', port: 6379, client: client})}))

auth(app);

// CONFIGURATION
// ==============================================
// Connect to DB
var db = config.database;
mongoose.connect(db);


// BodyParser for POST requests

app.use('/', express.static('public'));
app.use('/socket', express.static('node_modules/socket.io-client'));

// API
var apiRouter = require('./app/routes/api.js');
app.use('/api', apiRouter);

socket(io);

// START SERVER
// ==============================================
server.listen(config.port);
console.log('Serving beer on port ' + config.port);

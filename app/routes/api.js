// DEPENDENCIES
// ==============================================
var express = require('express');
var bodyParser = require('body-parser');
var config = require('../../config');

// Controllers
var projectCtrl = require('../controllers/projectCtrl');
var userCtrl = require('../controllers/userCtrl');
var updateCtrl = require('../controllers/updateCtrl');
var messagesCtrl = require('../controllers/messagesCtrl');

// ROUTES
// ==============================================
var router = express.Router();

function foo() {
  var gmAPI = new GoogleMapsAPI();
  var params = {
    location: '51.507868,-0.087689',
    size: '1200x1600',
    heading: 108.4,
    pitch: 7,
    fov: 40
  };
  var result = gmAPI.streetView(params);
  console.log(result);
}

router.route('/foo').get(foo);

module.exports = router

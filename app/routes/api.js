// DEPENDENCIES
// ==============================================
var express = require('express');
var bodyParser = require('body-parser');
var config = require('../../config');

// Controllers
var projectCtrl = require('../controllers/projectCtrl');

// ROUTES
// ==============================================
var router = express.Router();

// Return image if true 
// Return string 
// url, float - angle \n 
// url float
router.route('/images/:lat/:lon/:bool').get(projectCtrl.getImages)

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

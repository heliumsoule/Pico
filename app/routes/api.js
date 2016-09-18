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

module.exports = router

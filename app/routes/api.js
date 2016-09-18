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

// Return image if true 
// Return string 
// url, float - angle \n 
// url float
router.route('/images/:lat/:lon/:bool').get()

// router.route('/projects').get(projectCtrl.get)
// 						 .post(projectCtrl.create);
// router.route('/projects/add_reports').post(projectCtrl.addReports)
// router.route('/projects/add_user').post(projectCtrl.addUser)
// router.route('/projects/all').post(projectCtrl.all)
// router.route('/projects/fetch_reports').post(projectCtrl.fetchReports)
// router.route('/projects/get_list_updates').post(projectCtrl.getListUpdates)
// router.route('/projects/get_users').post(projectCtrl.getUsers)
// router.route('/projects/remove_report').post(projectCtrl.removeReport)
// router.route('/projects/remove_user').post(projectCtrl.removeUser)
// router.route('/projects/update_setting_fields').post(projectCtrl.updateSettingFields)

// router.route('/messages/send').post(messagesCtrl.send)
// router.route('/messages/update_setting_fields').post(messagesCtrl.updateSettingFields)

// router.route('/user').get(userCtrl.get)
// 					 .post(userCtrl.create);
// router.route('/user/add_coworker').post(userCtrl.addCoworker);
// router.route('/user/all').get(userCtrl.all);
// router.route('/user/block_user').post(userCtrl.blockUser);
// router.route('/user/exclude_project').post(userCtrl.excludeProject);
// router.route('/user/load_self_updates').post(userCtrl.loadSelfUpdates);
// router.route('/user/load_starred_updates').post(userCtrl.loadStarredUpdates);
// // router.route('/message/send').post()

// router.route('/update').post(updateCtrl.create);
// router.route('/update/update_priority').post(updateCtrl.updatePriority);
// router.route('/update/get_update_for_user').post(updateCtrl.getUpdateForUser);

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

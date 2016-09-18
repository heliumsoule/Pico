// Model
var Project = require('../models/project.js');
var Update = require('../models/update.js');
var User = require('../models/user.js');

// Creates new Project
exports.create = function(req, res) {
	// console.log("Server creating update " + JSON.stringify(req.body, false, 4));
	if (!req.body.user_id) {
		return res.status(500).send("user_id not found");
	}
	if (!req.body.project_id) {
		return res.status(500).send("project_id not found");
	}

	Project.findOne({_id: req.body.project_id}).exec(function(err, project) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!project) {
			return res.status(404).send("project not found");
		}

		User.findOne({_id: req.body.user_id}).exec(function (err, user) {
			if (err) {
				return res.status(500).send(err);
			}
			if (!user) {
				return res.status(404).send("user_not_found");
			}
			
			// Check user must be in a group
			var isUserFound = false;
			for (var i = 0; i < project.users.length; i++) {
				if (user.id == project.users[i].user_id) {
					isUserFound = true;
					break;
				}
			}
			if (!isUserFound) {
				return res.send("User not in this group, no update is created.");
			}

			var update = new Update();
			update.body = req.body.updateBody;
			update.settingsProperties = [];
			update.priority = req.body.priority;
			update.priorityPeople = [];
			update.user_id = user.id;
			update.project_id = project.id;

			for (var priority in req.body.priorityPeople) {
				update.priorityPeople.push(priority);
			}

			for (var i in req.body.settingsProperties) {
				update.settingsProperties.push({key: i, value: req.body.settingsProperties[i]});
			}

			update.save(function (err) {
				if (err) {
					return res.status(500).send(err);
				}
				user.addUpdate(update, function(err, umodel) {
					if (err) {
						return res.status(500).send(err);
					}
				});
				project.addUpdate(update, function(err, pmodel) {
					if (err) {
						return res.status(500).send(err);
					}
				});
				return res.send("success");
			});
		});
	});
};

exports.updatePriority = function(req, res) {
	if (!req.body.update_id) {
		return res.status(500).send("bad_update_id");
	}
	if (!req.body.update_priority) {
		return res.status(500).send("bad_update_priority");
	}
	if (!req.body.user_id) {
		return res.status(500).send("bad_user_id");
	}

	User.findOne({_id: req.body.user_id}).exec(function(err, user) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!user) {
			return res.status(404).send("user_not_found");
		}

		Update.findOne({_id: req.body.update_id}).exec(function(err, update) {
			if (err) {
				return res.status(500).send(err);
			}
			if (!update) {
				return res.status(404).send("update not found");
			}

			user.updateStarredList(update.id, req.body.update_priority, function(err, callback) {
				if (err) {
					return res.status(500).send(err);
				}
				return res.send("success");
			});
		});
	});
}

// TODO: not finished
exports.getUpdateForUser = function(req, res) {
	if (!req.body.user_id) {
		return res.status(404).send("user_id not found");
	}
	var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
	var offset = (req.body.offset) ? parseInt(req.body.offset) : 0;

	User.findOne({_id: req.body.user_id}).exec(function (err, user) {
		if (err) {
			return res.status(500).send("user not found");
		}

		Update.find({user_id: user.id}).skip(offset).limit(limit).exec(function (err, updates) {
			if (err) {
				return res.status(500).send(err);
			}
			return res.send(updates);
		});
	});
}
// Model
var User = require('../models/user.js');
var Project = require('../models/project.js');
var Update = require('../models/update.js');

// Creates new Project
exports.create = function(req, res) {

	console.log("Server received create user with" + req.body.name);
	var user = new User({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, password: req.body.password});
	// Add user authentication logics here
	user.points = 0;

	// Adding logics to have user
	user.settingsProperties = [];
	for (var i in req.body.settingsProperties) {
		user.settingsProperties.push({key: i, value: req.body.settingsProperties[i]});
	}

	user.save(function(err) {
	    if (err) return res.send(err);
	    return res.json({
	      message: 'User created.',
	      data: user.fname
	    });
	 });
};

// Returns list of projects with offset
exports.all = function(req, res) {
	if (!req.query.lat || !req.query.lon) {
		return res.status(404).send("Request location not found");
	}
	if (!req.query.timeStamp) {
		return res.status(404).send("Timestamp not found");
	}

	// build location
	var latitude = req.query.lat;
	var longtitude = req.query.lon;
	var time = new Date(req.query.timeStamp);
	console.log("Date was", req.query.timeStamp);
	console.log(time);

	// Default is 10 kilometers
	// TODO: more granular return results
	var radius = req.body.radius ? parseFloat(req.body.radius) : 10;
	Project.find({$and: [
		{loc: {$geoWithin: {$center: [[longtitude, latitude], radius] }}},
		{modifiedTimeStamp: {$gte: time}}
		]}).exec(function(err, projects) {

		if (err) {
			res.status(500).send(err);
		}
		// return a list of projects
		return res.send(projects);
	});

	// console.log("limit is ", parseInt(req.body.limit), parseInt(req.body.offset));
	// User.find({}).skip(offset).limit(limit).exec(function (err, users) {
	// 	if (err) return res.status(500).send(err);
	// 	res.json(users)
	// });*//*
}

exports.findById = function (data, callback) {
	User.findOne({_id: data.id}).exec(callback);
}

exports.findByEmail = function (data, callback) {
	User.findOne({email: data.email}).exec(function (err, model) {

		if (err) return callback(err);
		callback(null, model);
	});
}

exports.get = function(req, res) {
	// Success
	if (!req.query.id) {
		return res.status(404).send('bad_id')
	}
	
	User.find({_id: req.query.id}).exec(function (err, user) {
		if (err) return res.status(500).send(err);
		res.json(user)
	})
};

// Adds the coworker. Request body has to include two ID's
exports.addCoworker = function(req, res) {
	console.log("Adding coworker");
	if (!req.body.this_user_id) {
		return res.status(404).send('bad_user_id');
	}
	if (!req.body.coworker_id) {
		return res.status(404).send('bad_coworker_id');
	}
	if (!req.body.project_id) {
		return res.status(404).send('bad_group_id');
	}

	User.findOne({_id: req.body.this_user_id}).exec(function(err, user) {
		if (err) return res.status(500).send(err);
		if (!user) return res.status(404).send('user_not_found');
		User.findOne({_id: req.body.coworker_id}).exec(function(err, coworker) {
			if (err) return res.status(500).send(err);
			if (!coworker) return res.status(404).send('coworker_not_found');
			console.log("Almost adding coworker", user);
			Project.findOne({_id: req.body.project_id}).exec(function(err, project) {
				if (err) return res.status(500).send(err);
				if (!project) return res.status(404).send('project_not_found');
				user.addCoworker(coworker, project, function(err, umodel) {
							if (err) return res.status(500).send(err);
							console.log('success: Added to user');
				});

				coworker.addCoworker(user, project, function(err, umodel) {
					if (err) return res.status(500).send(err);
						res.send("Added to coworker");
				});
			})
		});
	});
};

exports.blockUser = function(req, res) {
	console.log("Blocking user");
	if (!req.body.this_user_id) {
		return res.status(404).send("bad_user_id");
	}
	if (!req.body.blocked_user_id) {
		return res.status(404).send("bad_blocked_user_id");
	}

	User.findOne({_id: req.body.this_user_id}).exec(function(err, user) {
		if (err) return res.status(500).send(err);
		if (!user) return res.status(404).send("User_not_found");
		User.findOne({_id: req.body.blocked_user_id}).exec(function(err, blocked_user) {
			if (err) return res.status(500).send(err);
			if (!user) return res.status(404).send("Blocked_user_not_found");
			user.blockUser(blocked_user, function(err, umodel) {
				if (err) return res.status(500).send(err);
				console.log("Blocked one way");
			});
			blocked_user.blockUser(user, function(err, bumodel) {
				if (err) return res.status(500).send(err);
				res.send("Both users should be blocked");
			})
		});
	});
}

exports.excludeProject = function(req, res) {
	console.log("Excluding project");
	if (!req.body.this_user_id) {
		return res.status(404).send("bad_user_id");
	}
	if (!req.body.project_id) {
		return res.status(404).send("bad_project_id");
	}
	if (!req.body.excluded_reason) {
		return res.status(404).send("bad_excluded_reason");
	}
	User.findOne({_id: req.body.this_user_id}).exec(function(err, user) {
		if (err) return res.status(500).send(err);
		if (!user) return res.status(404).send("User_not_found");
		Project.findOne({_id: req.body.project_id}).exec(function(err, project) {
			user.excludeProject(project, req.body.excluded_reason, function(err, excProj) {
				if (err) return res.status(500).send(err);
				console.log("Blocked project on user's end");
			});
			project.removeUser(user, function(err, remUser) {
				if (err) return res.status(500).send(err);
				res.send("Project list updated and User excluded Project List updated");
			})
		});
	});
}

exports.addUser = function(req, res) {

}

exports.addProject = function (req, res) {
	if (!req.body.user_id) {
		return res.status(404).send('bad_user_id')
	}
	if (!req.body.project_id) {
		return res.status(404).send('bad_project_id')
	}
	if (!req.body.status_level) {
		req.body.status_level = 'worker';
	}

	User.findOne({_id: req.body.user_id}).exec(function (err, user) {
		if (err) return res.status(500).send(err);
		if (!user) return res.status(404).send('user_not_found');
		Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
			if (err) return res.status(500).send(err);
			if (!project) return res.status(404).send('project_not_found');
			project.update({$push: {"users": {user_id: user._id, status_level: req.body.status_level}}},{safe: true, upsert: true, new: true});
			user.update({$push: {"projects": {project_id: req.body.project_id, status_level: req.body.status_level}}}, {safe: true, upsert: true, new: true});
		});
	});
}

exports.loadSelfUpdates = function(req, res) {
	if (!req.body.user_id) {
		return res.status(404).send("bad_user_id");
	}
	var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
	var offset = (req.body.offset) ? parseInt(req.body.offset) : 0;

	User.findOne({_id: req.body.user_id}).exec(function (err, user) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!user) {
			return res.status(404).send("user not found");
		}

		Update.find({user_id: user.id}).skip(offset).limit(limit).exec(function (err, updates) {
			if (err) {
				return res.status(500).send(err);
			}
			return res.send(updates);
		});
	});
}

exports.loadStarredUpdates = function(req, res) {
	if (!req.body.user_id) {
		return res.status(404).send("bad_user_id");
	}
	var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
	var offset = (req.body.offset) ? parseInt(req.body.offset) : 0;

	User.findOne({_id: req.body.user_id}).exec(function (err, user) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!user) {
			return res.status(404).send("user not found");
		}

		return res.send(user.starred_update.slice(offset, offset + limit));
	});
}
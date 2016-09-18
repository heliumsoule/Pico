// Model
var Project = require('../models/project.js');
var Report = require('../models/report.js');
var User = require('../models/user.js');
var Update = require('../models/update.js');

function replaceSettingProperties(project, req) {
	project.settingsProperties = [];
	for (var i in req.body.settingsProperties) {
		project.settingsProperties.push({key: i, value: req.body.settingsProperties[i]});
	}
}

// Creates new Project
exports.create = function(req, res) {

	console.log("Server creating project " + JSON.stringify(req.body, false, 4));

	// console.log(Project)

	if (!req.body.user_id) {
		return res.status(405).send("User name is invalid");
	}

	// create with user_id as admin. TODO: don't put user_id as in POST request
	User.findOne({_id: req.body.user_id}).exec(function(err, user) {
		if (!user) {
			// should never reach here
			return res.send("User name not found");
		}

		var project = new Project();

		project.tag = req.body.tag;
		project.name = req.body.name;
		project.desc = req.body.desc;

		project.lat = req.body.lat;
		project.lon = req.body.lon;
		project.loc = [req.body.lon, req.body.lat];

		project.color = req.body.color;
		project.timeStamp = Number(new Date());
		project.modifiedTimeStamp = project.timeStamp;

		// In the beginning only one worker
		project.numWorkers = 1;
		replaceSettingProperties(project, req);
		// console.log(project.settingsProperties);

		// TODO: remove duplicate user_id
		project.admins = [{user_id: user.id}];
		project.users = [{user_id: user.id, status_level: "admins"}];

		// In the beginning only one worker
		project.numWorkers = 1;
		project.save(function(err) {
				if (err) return res.status(500).send(err);
				res.json({
					message: 'Project created.',
					data: project.tag
				});
		 });
	});

};

exports.all = function(req, res) {
	var limit = req.body.limit ? req.body.limit : 10;
	var offset = req.body.offset ? req.body.offset : 0;

	Project.find({}).skip(offset).limit(limit).exec(function (err, projects) {
		if (err) return res.status(500).send(err);
		res.json(projects)
	})
};

exports.get = function(req, res) {
	// Success
	if (!req.query.id) {
		return res.status(404).send('bad_id')
	}

	Project.find({_id: req.query.id}).exec(function (err, project) {
		if (err) return res.status(500).send(err);
		res.json(project)
	});
};

exports.addUser = function (req, res) {
	if (!req.body.user_id) {
		return res.status(404).send('bad_user_id')
	}
	if (!req.body.project_id) {
		return res.status(404).send('bad_project_id')
	}

	if (!req.body.status_level) {
		req.body.status_level = 'worker';
	}


  // find the associated user
	User.findOne({_id: req.body.user_id}).exec(function (err, user) {

		if (err) return res.status(500).send(err);
		if (!user) return res.status(404).send('user_not_found');

		// find the associated project
		Project.findOne({_id: req.body.project_id}).exec(function (err, project) {

				if (err) return res.status(500).send(err);
				if (!project) return res.status(404).send('project_not_found');

				// if user is already in the list, throw error
				// TODO: mongoose uses linear array, which is highly inefficient
				// Use Mongo API call

				for (var idx = 0; idx < project.users.length; idx++) {
					// console.log(project.users[idx].user_id + " " + req.body.user_id);
					if (project.users[idx].user_id == req.body.user_id) {
						return res.send('User already exists, no change were made');
					}
				}

				// add user to admin list if he is added with admin privelege
				// TODO: use cookie to send privelege
				if (req.body.status_level === "admins") {
					project.update({$push: {"admins": {user_id: user.id}}});
				}


				// add user to corresponding project
				project.update({$push: {"users": {user_id: user.id, status_level: req.body.status_level}}},
						{safe: true, upsert: true, new: true}, function (err, model) {
							if (err) return res.status(500).send(err);

							user.update({$push: {"projects": {project_id: project.id, status_level: req.body.status_level}}}, {safe: true, upsert: true, new: true}, function (err, umodel) {
									// increse number of users
									project.update({$inc: {numWorkers: 1}}, function (err, callback) {
										if (err) return res.status(500).send(err);

										// add project to corresponding user
										// no need to check for duplicate since we have checked above
										user.update({$push: {"projects": {project_id: project.id, status_level: req.body.status_level}}},
												{safe: true, upsert: true, new: true}, function (err, umodel) {

											if (err) return res.status(500).send(err);

											project.modifiedTimeStamp = Number(new Date());
											project.save(function(err){
												if (err) return res.status(500).send(err);														
												res.send('success');	
											});

											
										});
									});


							});

				});

				//
			});
		});
};

exports.getListUpdates = function(req, res) {
	if (!req.body.projectID) {
		return res.status(404).send('project_id not found');
	}
	Project.findOne({_id: req.body.projectID}).exec(function (err, project) {
		if (err) {
			return res.status(500).send(err);
		}

		if (!project) {
			return res.send("Project not found");
		}

		console.log("getListUpdates should be here right now");
		res.send(project.updates.splice(req.body.offset, req.body.limit));
	});
}


// TODO: only admin can remove users
exports.removeUser = function(req, res) {
	if (!req.body.user_id) {
		return res.status(404).send('user_id not found');
	}
	if (!req.body.project_id) {
		return res.status(404).send('project_id not found');
	};

	// find the associated user
	User.findOne({_id: req.body.user_id}).exec(function (err, user) {
		if (err) {
			return res.status(500).send(err);
		}

		if (!user) {
			return res.send("User not found");
		}

		Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
			if (err) {
				return res.status(500).send(err);
			}
			if (!project) {
				return res.send("Project not found");
			}

			var foundMatch = false;
			for (var idx = 0; idx < project.users.length; idx++) {
				// console.log(project.users[idx].user_id + " " + req.body.user_id);
				if (project.users[idx].user_id == req.body.user_id) {
					foundMatch = true;
					break;
				}
			}
			if (foundMatch == false) {
				return res.send("User not found");
			}

			// Remove from user list
			project.update({$pull: {"users": {user_id: req.body.user_id} }}).exec( function(err, callback) {
				if (err) {
					return res.status(500).send(err);
				}

				project.update({$inc: {numWorkers: -1}}, function (err, callback) {
					if (err) {
						return res.status(500).send(err);
					}

					// Remove from admin list. How to differentiate?
					project.update({$pull: {"admins": {user_id: req.body.user_id} }}).exec( function(err, callback) {
						if (err) {
							return res.status(500).send(err);
						}
						return res.send("User removed");
					});
				});

			});

		});
	});
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getUsers = function(req, res) {
	if (!req.body.project_id) {
		return res.status(404).send('project_id not found');
	}

	// default value is 10
	var lim = (!req.body.limit) ? 10 : req.body.limit;
	if (lim <= 0) {
		return res.send("Number of returned users must be strictly positive");
	}

	Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!project) {
			return res.send("project not found");
		}

		// Initiate a few users
		users = []
		for (var idx = 0; idx < lim && idx < project.users.length; idx++) {
			users.push(project.users[idx]);
		}

		// Call with replacement
		for (var idx = lim; idx < project.users.length; idx++) {
			var replaceIndex = getRandomInt(0, project.users.length);
			if (replaceIndex < lim) {
				users[replaceIndex] = project.users[idx];
			}
		}

		return res.send(users);
	});
};

exports.updateSettingFields = function(req, res) {
	if (!req.body.project_id) {
		return res.status(404).send('project_id not found');
	}
	Project.findOne({_id: req.body.project_id}).exec(function(err, project) {
		if (err) {
			return res.status(500).send(err);
		}

		if (!project) {
			return res.status(500).send('project not found');
		}

		replaceSettingProperties(project, req);

		project.update({$set: {settingsProperties: project.settingsProperties}}).exec(function(err, callback) {
			if (err) {
				return res.status(500).send(err);
			}
			return res.send('success');
		});
	});
};

exports.fetchReports = function(req, res) {
	if (!req.body.project_id) {
		return res.status(404).send("project_id not found");
	}
	var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
	var offset = (req.body.offset) ? parseInt(req.body.offset) : 0;

	Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!project) {
			return res.send("project not found");
		}

		// Assume nice behavior, skipping property
		return res.send(project.reports.slice(offset, offset + limit));
	});
};

exports.addReports = function(req, res) {
	if (!req.body.project_id) {
		return res.status(404).send("project_id not found");
	}

	if (!req.body.type) {
		return res.status(404).send('type not found');
	}

	if (!req.body.body) {
		return res.status(404).send('body not found');
	}

	/*if (!req.body.metadata) {
		return res.status(404).send('metadata not found');
	}*/

	if (!req.body.refInformation) {
		return res.status(404).send('refInformation not found')
	}

	Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
		if (err) {
			return res.status(500).send(err);
		}

		if (!project) {
			return res.status(500).send('project_id not found');
		}

		var mReport = new Report();
		mReport.timeStamp = Number(new Date());
		mReport.type = req.body.type;
		mReport.body = req.body.body;

		mReport.refInformation = []
		for (var i in req.body.refInformation) {
			mReport.refInformation.push({key: i, value: req.body.refInformation[i]});
		}

		mReport.save( function (err) {
			if (err) {
				return res.status(500).send(err);
			}
			// console.log(project);
			project.update({$push: {"reports": mReport.id}}).exec( function(err, callback) {
				if (err) {
					return res.status(500).send(err);
				}
				return res.send('success');
			});
		});
	});
};

exports.removeReport = function(req, res) {
	if (!req.body.project_id) {
		return res.status(404).send("project_id not found");
	}
	if (!req.body.report_id) {
		return res.status(404).send("report_id not found");
	}

	Project.findOne({_id: req.body.project_id}).exec(function (err, project) {
		if (err) {
			return res.status(500).send(err);
		}
		if (!project) {
			return res.status(500).send("project not found");
		}

		Report.findOne({_id: req.body.report_id}).exec(function (err, report) {
			if (err) {
				return res.send(err);
			}
			if (!report) {
				return res.status(500).send("report not found");
			}

			project.update({ $pull: {"reports": {$in: [report.id]} }}).exec( function(err, callback) {
				if (err) {
					return res.status(500).send(err);
				}
				return res.send('success');
			});
		});
	});
};
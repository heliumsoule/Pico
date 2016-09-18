var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = require('./project.js');

var projectObjectId = projectSchema.ObjectId;

// user schema
var UserSchema = new Schema({
  fname: String,
  lname: String,

  email: String,
  points: Number,
  settingsProperties: [{key: String, value: String}],
  // NOTE: added password for now future hash
  password: String,
  // Project fields
  projects: [{project_id: Schema.ObjectId, status_level: String}],
  excluded_projects: [{project_id: Schema.ObjectId, excluded_reason: String}],

  // coworker fields
  coworkers: [{coworker_id: Schema.ObjectId, project_id: Schema.ObjectId, project_name: String}],
  excluded_coworkers: [Schema.ObjectId],

  // messages fields
  // messages: [{coworker_id: Schema.ObjectId, conversations: [Schema.Object]}]

  // Update related logics
  starred_update: Array,
  updates: [Schema.ObjectId],
  email_list: [{}]
});

UserSchema.methods.addCoworker = function(coworker, project, callback) {
  this.update({$push: {"coworkers": {coworker_id: coworker.id, project_id: project.id, project_name: project.name}}},
              {safe: true, upsert: true, new: true}, callback);
}

UserSchema.methods.blockUser = function(blockedUser, callback) {
  this.update({$push: {"excluded_coworkers": blockedUser.id}}, {safe: true, upsert: true, new: true}, callback);
}

UserSchema.methods.excludeProject = function(excludedProject, status_level, callback) {
  this.update({$push: {"excluded_projects": {project_id: excludedProject.id, excluded_reason: status_level}}},
              {safe: true, upsert: true, new: true}, callback);
}

UserSchema.methods.addUpdate = function(update, callback) {
  this.update({$push: {"updates": update}}, {safe: true, upsert: true, new: true}, callback);
}

UserSchema.methods.updateStarredList = function(update_id, update_priority, callback) {
  if (update_priority == 1) {
    this.update({$addToSet: {"starred_update": update_id} }, callback);
  }
  else if (update_priority == -1) {
    this.update({$pull: {"starred_update": update_id} }, callback);
  }
}

UserSchema.methods.fullJSON = function(){
  // Sending full info of the user
  var jsonObj = this.toObject();
  delete jsonObj.password;
  return jsonObj
}

// Object that is being sent to user / White listing
UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            userID: ret._id,
            fname: ret.email,
            lname: ret.registered,
            settingsProperties: ret.settingsProperties
        };
        return retJson;
    }
});

module.exports = mongoose.model('User', UserSchema);

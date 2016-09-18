var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var ProjectSchema = new Schema({
  name: String,
  tag: String,
  desc: String,
  numWorkers: Number,
  // Used to send to client
  lat: Number,  
  lon: Number,
  // WARNING: used to simplify query logic 
  loc: [Number], // [<longtitude>, <latitude>]
  color: String,
  settingsProperties: Array,
  timeStamp: Date,
  modifiedTimeStamp: Date,
  
  // Definining relation to other data models
  admins: [{user_id: Schema.ObjectId}],
  users: [{user_id: Schema.ObjectId, status_level: String}],
  updates: Array,
  // Merged with reports 
  // reports: Array,
});

// 2dsphere indexing
ProjectSchema.index({loc: "2dsphere"});

// method to compare a given password with the database hash
ProjectSchema.methods.setProjectSettings = function(jsonFile) {

}

ProjectSchema.methods.addUpdate = function(update, callback) {
  this.update({$push: {"updates": update}}, {safe: true, upsert: true, new: true}, callback);
}

ProjectSchema.methods.updatePriority = function(update_id, updatePriority, callback) {
  this.update({"updates.id": update_id}, {"$inc": {"updates.$.priority": updatePriority}}, callback);
}

ProjectSchema.methods.addAdmins = function(adminUserID) {

}

ProjectSchema.methods.addUser = function(user, callback) {

}

ProjectSchema.methods.removeUser = function(user, callback) {
  this.update({$pull: {"users": {user_id: user.id}}}, {safe: true, upsert: true, new: true}, callback);
}

// ProjectSchema.methods.verifyPassword = function(password, cb) {

// };

// Object that is being sent to user / White listing
ProjectSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            projectID: ret._id,
            tag: ret.tag,
            name: ret.name,
            desc: ret.desc, 
            numWorkers: ret.numWorkers,
            // loc: ret.loc,
            lat: ret.lat, 
            lon: ret.lon,
            timeStamp: ret.timeStamp,
            color: ret.color,
            settingsProperties: ret.settingsProperties
        };
        return retJson;
    }
});

module.exports = mongoose.model('Project', ProjectSchema);

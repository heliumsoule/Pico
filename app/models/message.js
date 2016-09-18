var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema

// NOTE: to add Image
var MessageSchema = new Schema({
  timeStamp: Date,
  fromUserID: Schema.ObjectId,
  toUserID:    Schema.ObjectId,
  message: String,  // might use Picture
  settingsProperties: [{key: String, value: String}]
});


// method to compare a given password with the database hash
MessageSchema.methods.setProjectSettings = function(jsonFile) {

}

MessageSchema.methods.addAdmins = function(adminUserID) {

}


module.exports = mongoose.model('Message', MessageSchema);

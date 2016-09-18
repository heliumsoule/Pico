var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var UpdateSchema = new Schema({
  timeStamp: Date,
  user_id: Schema.ObjectId,
  project_id: Schema.ObjectId,
  body: String,
  priority: Number,
  priorityPeople: Array,
  pinned: Boolean, 
  pinned_until_ts: Date, 
  settingsField: [{key: String, value: String}]
});

UpdateSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            updateID: ret._id,
            user_id: ret.user_id,
            project_id: ret.project_id,
            body: ret.body,
            timestamp: ret.timeStamp,
            settingsProperties: ret.settingsProperties
        };
        return retJson;
    }
});

module.exports = mongoose.model('Update', UpdateSchema);
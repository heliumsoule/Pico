var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var ReportSchema = new Schema({
  timeStamp: Date,
  type: String, // feedback, or complaints 
  body: String,
  project_id: Schema.ObjectId,
  refInformation: [{key: String, value: String}]
});


module.exports = mongoose.model('Report', ReportSchema);
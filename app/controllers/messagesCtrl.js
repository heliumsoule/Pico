// Model
var Message = require('../models/message.js');
var User = require('../models/user.js');

exports.send = function(req, res) {
  if (!req.body.this_user_id) {
    return res.status(404).send("bad_user_id");
  }
  if (!req.body.coworker_id) {
    return res.status(404).send("bad_coworker_id");
  }
  if (req.body.this_user_id == req.body.coworker_id) {
    return res.send("Cannot send message to yourself!");
  }
  if (!req.body.message) {
    return res.status(404).send("bad_message");
  }

  User.findOne({_id: req.body.this_user_id}).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).send("user_not_found");
    }

    User.findOne({_id: req.body.coworker_id}).exec(function(err, coworker) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!coworker) {
        return res.status(404).send("user_not_found");
      }

      var mMessage = new Message();
      mMessage.timeStamp = Date.now();
      mMessage.fromUserID = user._id;
      mMessage.toUserID = coworker._id;
      mMessage.message = req.body.message;

      mMessage.save(function (err) {
        if (err) {
          return res.send(err);
        }
        
        return res.json({
          message: 'Message created',
          from: user.fname,
          to: coworker.fname
        });

      });
    });
  });

}

exports.updateSettingFields = function(req, res) {
  if (!req.body.message_id) {
    return res.status(404).send("message_id_not_found");
  }
  if (!req.body.settingsProperties) {
    return res.status(404).send("settingProperties not found");
  }

  Message.findOne(req.body.message_id).exec(function (err, message) {
    if (err) {
      return res.send(err);
    }
    if (!message) {
      return res.status(500).send("Message not found.");
    }

    message.settingsProperties = [];
    for (var i in req.body.settingsProperties) {
      message.settingsProperties.push({key: i, value: req.body.settingsProperties[i]});
    }

    message.update({$set: {settingsProperties: message.settingsProperties}}).exec(function(err, callback) {
      if (err) {
        return res.send(err);
      }
      return res.send('success');
    });
  });
}
var Message = require('../models/message');
var fall = require('async-waterfall');

var socketio = function (io) {

  var allSockets = {};

  io.on('connection', function (socket) {
    console.log("connected!!")

    var tempSocket = socket;
    var user_id = '';

    var array = [];

    socket.emit('please sync', {}) //telling user to sync as soon as connected

    socket.on('sync', function (user_id) { //syncing user_id with socket
      user_id = user_id;
      allSockets[user_id] = tempSocket;
    })

    socket.on('new message', function(data) {

      // data = {message: message, to: some_user_id}

      array.push({from: user_id, to: data.to, message: data.message});

      if (allSockets[data.to]) {
        allSockets[data.to].emit('new message', {
          from: user_id,
          message: data.message
        })
      }
    })

    socket.on('disconnect', function () {
      allSockets[user_id] = null; //removing socket from socket list

      var tasks = [];

      array.forEach(function (entry) {
        var task = function (callback) {
          var message = new Message({from: entry.from, text: entry.message, to: entry.to});
          message.save(callback)
        }
        tasks.push(task);
      })

      fall(tasks, function (err, data) {
        console.log("done success")
      })
    })
  })
}

module.exports = socketio;

var io = require('../../server').io;

io.on('connection', function(socket) {
  console.log("SOCKET.IO CONNECTION!");
});

function getNextTileURL(lat, lon, callback) {
  console.log("getting next tile links");
  // Returns next possible locations for view for a given location
  io.sockets.emit('latlng', {lat: lat, lng: lon});
  io.sockets.on('pano', function(data) {
    callback(data.links);
  });
}

function get360Image(lat, lon, callback) {
  console.log("getting panorama image");
  // Creates
}

exports.getImages = function(req, res) {
  if (!req.params.lat) {
    return res.status(404).send("Lat not found");
  }

  if (!req.params.lon) {
    return res.status(404).send("Lon not found");
  }
  var lat = req.params.lat;
  var lon = req.params.lon;
  var bool = req.params.bool;

  if (req.params.bool) {
    get360Image(lat, lon, function(image_link) {
      res.send(image_link);
    });
  } else {
    // Send only next tile URL
    getNextTileURL(lat, lon, function() {
      // TODO
    });
  }
};

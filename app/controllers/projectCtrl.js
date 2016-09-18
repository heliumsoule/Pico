var spawn = require('child_process').spawn;
var sys = require('sys');
var exec = require('child_process').exec;
require('shelljs/global');
var Upload = require('s3-uploader');
var panorama = require('google-panorama-by-location'); 


function getNextTileURL(lat, lon) {
	// Returns next possible locations for view for a given location

}

function getTranformedImage(lat, lon, callback) {
	get360Image(lat, lon, function(S3Link){
		// Convert the image into nueral model

	});
}

function get360Image(lat, lon, callback) {
	// Getting Pan ID
	var panID = getPanID(lat, lon, function(panID) {
		// Generating image from panID
		generate360Image(panID, function(panID) {
			// Upload picture to S3 here
			var link = "dummy-S3-link/" + panID;
			callback(link);
		});
	});
}

function generate360Image(panID, callback) {	
	var child = exec('$PWD/streetviewdownload.sh ' + panID, function(error, stdout, stderr) {
  		if (error) console.log(error);
  		callback(panID);
	});
}

function getPanID(lat, lon, callback){
	var location = [lat, lon];
	panorama(location, function (err, result) {
  		if (err) {
  			// TODO: handle some error here
  		}
  		console.log("PanoID:", result.id);
  		callback(result.id);
	});
}


exports.getImages = function(req, res) {
	console.log(req.params);
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
		res.send(getNextTileURL(lat, lon))
	}
};
var spawn = require('child_process').spawn;
var sys = require('sys');
var exec = require('child_process').exec;
require('shelljs/global');

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var Upload = require('s3-uploader');
var panorama = require('google-panorama-by-location'); 


function getNextTileURL(lat, lon) {
	// Returns next possible locations for view for a given location

}

function getTranformedImage(lat, lon, callback) {
	get360Image(lat, lon, function(S3Link){
		// Convert the image into nueral model here
		// NOTE: Jing, Do the model callback here

	});
}

function get360Image(lat, lon, callback) {
	// Getting Pan ID
	var panID = getPanID(lat, lon, function(panID) {
		// Generating image from panID
		generate360Image(panID, function(panID) {
			// Upload picture to S3 here
			uploadS3Image(panID, function(S3Link) {
				// Passing back uploaded link
				callback(S3Link);	
			});
			
		});
	});
}

function uploadS3Image(panID, callback) {
	var client = new Upload('my_s3_bucket', {
		aws: AWS, 
		versions: [{
	    	maxHeight: 4000,
	    	maxWidth: 8000,
	    	format: 'jpg',
	    	quality: 80,
	  	}]
	});
	// NOTE: Upload the picture here
	client.upload("/picture/" + panID + ".jpg", {}, function(err, versions, meta) {
  		if (err) { throw err; }
  		versions.forEach(function(image) {
    		console.log(image.width, image.height, image.url);
    		callback(image.url);
    		// 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg 
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
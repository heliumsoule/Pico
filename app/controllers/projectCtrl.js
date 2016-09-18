'use strict';
// Model Functions
const path = require('path');

// let grpc = require('grpc');
// const PROTO_PATH = path.resolve('../python_server/proto/neural_contract.proto');
// let server_loc = 'ec2-54-172-29-68.compute-1.amazonaws.com';
// let neural_server = grpc.load(PROTO_PATH).neuralstyle;

// Setting up image related things
var spawn = require('child_process').spawn;
var sys = require('sys');
var exec = require('child_process').exec;
require('shelljs/global');

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
// var Upload = require('s3-uploader');
var panorama = require('google-panorama-by-location'); 

// var io = require('../../server').io;

// io.on('connection', function(socket) {
//   console.log("SOCKET.IO CONNECTION!");
// });

// function getNextTileURL(lat, lon, callback) {
//   console.log("getting next tile links");
//   // Returns next possible locations for view for a given location
//   io.sockets.emit('latlng', {lat: lat, lng: lon});
//   socket.on('pano', function(data) {
//     callback(data.links);
//   });
// }

function getTranformedImage(lat, lon, callback) {
	get360Image(lat, lon, function(panID, S3Link){
		// Convert the image into nueral model here
		let client = new neural_server.ImageStyleServer(server_loc, grpc.credentials.createInsecure())
    	let name = panID + ".jpg";
    	let style_data = {name, aws_link};
    	client.styleImage(style_data, (err, response) => {
			if (err) {
		    	console.log("The error was", err);
			} else {
		    	console.log("The server response was", response);
		    	callback(response.aws_link);
			}
    	});
	});
}


let classify = (name, aws_link) => {
    let client = new neural_server.ImageStyleServer(server_loc, grpc.credentials.createInsecure())
    let style_data = {name, aws_link};
    
    client.styleImage(style_data, (err, response) => {
		if (err) {
		    console.log("The error was", err);
		} else {
		    console.log("The server response was", response);
		}
    });
}

function get360Image(lat, lon, callback) {
	// Getting Pan ID
	var panID = getPanID(lat, lon, function(panID) {
		// Generating image from panID
		generate360Image(panID, function(panID) {
			// Upload picture to S3 here
			uploadS3Image(panID, function(panID, S3Link) {
				// Passing back uploaded link
				callback(panID, S3Link);	
			});
			
		});
	});
}

function uploadS3Image(panID, callback) {
	var dummyS3URL = "https://s3.amazonaws.com/normalpicture/AEnBXl1TWo1KDmUduOhq3A.jpg";
	callback(pandID, dummyS3URL);

	// var client = new Upload('my_s3_bucket', {
	// 	aws: AWS, 
	// 	versions: [{
	//     	maxHeight: 4000,
	//     	maxWidth: 8000,
	//     	format: 'jpg',
	//     	quality: 80,
	//   	}]
	// });
	// // NOTE: Upload the picture here
	// client.upload("/picture/" + panID + ".jpg", {}, function(err, versions, meta) {
 //  		if (err) { throw err; }
 //  		versions.forEach(function(image) {
 //    		console.log(image.width, image.height, image.url);
 //    		callback(image.url);
 //    		// 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg 
 //  		});
	// });
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

	if (req.params.bool === "true") {
		get360Image(lat, lon, function(image_link) {
			res.send(image_link);
		});
	} else if (req.params.bool === "false") {
		// Send only next tile URL
		// res.send(getNextTileURL(lat, lon))
	}
};

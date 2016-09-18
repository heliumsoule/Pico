'use strict';

let grpc = require('grpc');

const PROTO_PATH = __dirname + '/../proto/neural_contract.proto';
let server_loc = 'ec2-54-172-29-68.compute-1.amazonaws.com';
let neural_server = grpc.load(PROTO_PATH).neuralstyle;

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

//classify("Insert filename here");

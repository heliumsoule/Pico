function getNextTileURL(lat, lon, callback) {
	// Returns next possible locations for view for a given location

}

function get360Image(lat, lon, callback) {
	// Creates 
}



exports.getImages = function(req, res) {
	if (!req.body.lat) {
		return res.status(404).send("Lat not found");
	}

	if (!req.body.lon) {
		return res.status(404).send("Lon not found");
	}
	var lat = req.body.lat;
	var lon = req.body.lon;
	var bool = req.body.bool;

	if (req.body.bool) {
		get360Image(lat, lon, function(image_link) {
			res.send(image_link);
		});
	} else {
		// Send only next tile URL
		res.send(getNextTileURL(lat, lon))
	}
};

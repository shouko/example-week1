console.log("hello world!");

var http = require("http");
var port = 1337;

http.createServer(function (req, res){

	var query = require('url').parse(req.url,true).query;
	console.log("Request from: " + req.connection.remoteAddress + "\n" + query.fn + "\n");

	if(query.fn){

		fs = require('fs');
		// provide requested css, js, images, while preventing directory traversal
		fs.readFile('theme/'+ query.fn.replace(/\.\./g,""), 'utf8', function (err,data) {
		  if (err) {
	  		res.writeHeader(404, {"Content-Type": "text/html"});
			res.end("404 - Not Found");
		    return console.log(err);
		  }
		  res.end(data);
		});

	}else{
	
	res.writeHeader(200, {"Content-Type": "text/html"});

	var data = '<html><head>';
	data += '<link href="?fn=js-image-slider.css" rel="stylesheet" type="text/css" />';
    data += '<script src="?fn=js-image-slider.js" type="text/javascript"></script>';
	data += '</head><body><div id="sliderFrame"><div id="slider">';

	var request = require("request");
	var url = "http://graph.facebook.com/2014NTUIMCAMP/photos?type=uploaded";

	request.get(url, function (err, body, response) {

		response = JSON.parse(response);
	    response.data.forEach(function (val, idx) {

	      data += "<img src='" + val.images[0].source + "' />";
		});

			data += "</div></body></html>";
			res.end(data);
	});

	}
}
).listen(port);

console.log("server created! " + port);

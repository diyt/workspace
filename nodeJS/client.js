var http = require('http');

// Create the option to be used to make the request.
var options ={
    host: '127.0.0.1',
    port: '8080',
    path: '/index.htm'
};

// Callback function is used to deal with response
var callback = function (response) {
	// Continuously update stream with data
	var body = '';
	response.on('data', function(data) {
		body += data;
	});
	response.on('end', function(data) {
		// Data received completely.
        console.log(body);
	});
};

// Make a request to the server
var req = http.request(options, callback);
req.end();
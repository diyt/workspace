var http = require('http');

http.createServer( function(request, response) {
	response.writeHead(200, { 'Content-Type':'text/html'});
	response.write("Hello world from NodeJS!" + '<br>');
	response.write(__filename + '<br>');
	response.write(__dirname);
	response.end();
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
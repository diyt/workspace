var express = require('express');
var app = express();

// Use static assets
app.use(express.static('publicAssets'));

app.get('/', function (req, res) {
   res.send('<h1> Hello World </h1>');
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
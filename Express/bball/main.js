var express = require('express');
var app = express();
var path = require('path');
var mustacheExpress = require('mustache-express');
var router = require(path.join(__dirname, "./router"));
var port = 8000;


// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');


// Use router.js for routing
app.use("/", router);


app.listen(port, function(){
  console.log("Server is listenning to port 8000...");
});
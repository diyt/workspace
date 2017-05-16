var express = require('express');
var app = express();
var path = require('path');
var exphbs = require('express-handlebars');
var router = require(path.join(__dirname, "./router"));
var port = 1234;

app.set('views', __dirname + '/views');

// Use handlebar template engine
app.engine('html', exphbs()); 
app.set('view engine', 'handlebars');

// Define resources paths
app.use('/bootstrap', express.static(path.join(__dirname, 'public/bootstrap')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


// Use router.js for routing
app.use("/", router);


app.listen(port, function(){
  console.log("Kanban board service is initialized. Server is listenning to port " + port + " ....");
});


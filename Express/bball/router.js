var express = require('express');
var router = express.Router();
var path = require('path');

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



// home page
router.get('/', function(req, res){
	res.render('homePage', {title: 'Home Page'});
});


// roster page
// Load data module
var rosterData = require(path.join(__dirname, './data/rosterData'));
router.get('/roster', function(req, res){
    res.render('roster', rosterData);
});


// route to process request of adding new player
router.post('/addPlayer', upload.array(), function(req, res){
    rosterData.addplayer(req.body);
    res.sendStatus(200);
});


module.exports = router;
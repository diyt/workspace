var express = require('express');
var router = express.Router();
var path = require('path');

// modules to parse http request
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

// Load projectData module
var projectsData = require(path.join(__dirname, './data/projectData'));


router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// home page
router.get('/mainPage', function(req, res){
	res.render('mainPage.html');
});


// Project detail page
router.get('/projectDetail/:projectTitle', function(req, res) {
	var projectTitle = req.params.projectTitle;
  res.render('project-details.html', { title: projectTitle });
});


// RESTful API to get all projects
router.post('/getProjects', upload.array(), function(req, res) {
	res.status(200).json(projectsData);
})

// RESTful API to get projectDetails
router.post('/addProject/:projectTitle', upload.array(), function(req, res) {
	var projectTitle = req.params.projectTitle;
	if (projectsData[projectTitle] !== undefined) {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' already exists.' });
	} else {
		projectsData.addProject(projectTitle);
		res.sendStatus(200);
	}
})


// RESTful API to get projectDetails
router.post('/getProject/:projectTitle', upload.array(), function(req, res) {
	var projectTitle = req.params.projectTitle;
	if (projectsData[projectTitle] !== undefined) {
		res.status(200).json(projectsData[projectTitle]);
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exist.' });
	}
})

// RESTful API to update certain project. Not used now
router.post('/updateProject/:projectTitle', upload.array(), function(req, res) {
	var projectTitle = req.params.projectTitle;
	var updatedProject = req.body;
	if (projectsData[projectTitle] !== undefined) {
		projectsData.updateProject(projectTitle, updatedProject);
		res.sendStatus(200);
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exist.' });
	}
	
})

// RESTful API to add a new stage
router.post('/addStage/:stageTitle', upload.array(), function(req, res) {
	var stageTitle = req.params.stageTitle;
	var projectTitle = req.body.projectTitle;

	if (projectsData[projectTitle] !== undefined) {
		projectsData.addStage(projectTitle, stageTitle);
		res.sendStatus(200);
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exists.' });
	}
})

// RESTful API to remove a stage
router.post('/removeStage/:stageTitle', upload.array(), function(req, res) {
	var stageTitle = req.params.stageTitle;
	var projectTitle = req.body.projectTitle;

	if (projectsData[projectTitle] !== undefined) {
		var result = projectsData.removeStage(projectTitle, stageTitle);
		if (result) {
			res.sendStatus(200);
		} else {
			res.status(500).json({ error: 'Stage ' + stageTitle  + ' doesn\'t exist.' });
		}
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exists.' });
	}	
})

// RESTful API to add a new task
router.post('/addTask', upload.array(), function(req, res) {
	var taskTitle = req.body.taskTitle;
	var requester = req.body.requester;
	var stageTitle = req.body.stageTitle
	var projectTitle = req.body.projectTitle;

	if (projectsData[projectTitle] !== undefined) {
		var result =projectsData.addTask(projectTitle, stageTitle, taskTitle, requester);
		if (result) {
			res.sendStatus(200);
		} else {
			res.status(500).json({ error: 'Stage ' + stageTitle  + ' doesn\'t exist.' });
		}
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exists.' });
	}
})

// RESTful API to add a new task
router.post('/removeTask', upload.array(), function(req, res) {
	var taskTitle = req.body.taskTitle;
	var stageTitle = req.body.stageTitle
	var projectTitle = req.body.projectTitle;

	if (projectsData[projectTitle] !== undefined) {
		var result =projectsData.removeTask(projectTitle, stageTitle, taskTitle);
		if (result) {
			res.sendStatus(200);
		} else {
			res.status(500).json({ error: 'Stage ' + stageTitle  + ' doesn\'t exist.' });
		}
	} else {
		res.status(500).json({ error: 'Project ' + projectTitle  + ' doesn\'t exists.' });
	}
})


module.exports = router;
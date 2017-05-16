// Load dao module
var path = require('path');
var db = require(path.join(__dirname, './dao'));

const MAX_TASK_NUM = 5;

var projects = {
	getProjects: function(success) {
		var successCallback = function(data) {
			// Update local data object
			for (var i in data.Items) {
				var item = data.Items[i];
				var title = item.title;
				projects[title] = item;
			}

			if(success) {
				success();
			}
		};
		var failureCallback = function(err) {
			console.error("Failed to get projects data from database.");
		}
		db.getProjects(successCallback, failureCallback);
	},

	addProject: function(projectTitle) {
		this[projectTitle] = {
			title: projectTitle,
			stageMap: {},
			taskMap: {},
			log: ['Project "' + projectTitle + '" was created at ' + new Date()]
		};

		db.addProject(projectTitle);

	},
	addStage: function(projectTitle, stageTitle) {
		this[projectTitle].stageMap[stageTitle] = {
			maxTaskNum: MAX_TASK_NUM,
	  	taskList: []
		}
		this[projectTitle].log.unshift('Stage "' + stageTitle + '" was created at ' + new Date());

		db.addStage(projectTitle, stageTitle);
	},
	removeStage: function(projectTitle, stageTitle) {
		if(this[projectTitle].stageMap[stageTitle] == undefined) {
			return false;
		} else {
			delete this[projectTitle].stageMap[stageTitle]
			this[projectTitle].log.unshift('Stage "' + stageTitle + '" was removed at ' + new Date());
			db.removeStage(projectTitle, stageTitle)
			return true;
		}
	},
	updateProject: function(projectTitle, updatedProject) {
		this[projectTitle] = updatedProject;
		this[projectTitle].log.unshift('Project "' + projectTitle + '" was updated at ' + new Date());
	},
	addTask: function(projectTitle, stageTitle, taskTitle, requester) {
		if(this[projectTitle].stageMap[stageTitle] == undefined) {
			return false;
		} else {
			this[projectTitle].taskMap[taskTitle] = {
				requester: requester,
				stage: stageTitle
			}
			this[projectTitle].stageMap[stageTitle].taskList.push(taskTitle);
			this[projectTitle].log.unshift('Task "' + taskTitle + '" was created at stage ' + stageTitle + ' at ' + new Date());
			db.addTask(projectTitle, stageTitle, taskTitle, requester);
			return true;
		}
	},
	removeTask: function(projectTitle, stageTitle, taskTitle) {
		if(this[projectTitle].stageMap[stageTitle] == undefined) {
			return false;
		} else {
			delete this[projectTitle].taskMap[taskTitle];
			var taskList = this[projectTitle].stageMap[stageTitle].taskList;
			var i = 0;
			for(i in taskList) {
				if(taskList[i] === taskTitle) {
					taskList.splice(i, 1);
				}
			}
			this[projectTitle].log.unshift('Task "' + taskTitle + '" was removed from stage ' + stageTitle + ' at ' + new Date());
			db.removeTask(projectTitle, stageTitle, taskTitle, i);
			return true;
		}
	}
};

// Sync local data from database initially
projects.getProjects(function() {
	console.log('Initial data is: ' + JSON.stringify(projects));
});

module.exports = projects;
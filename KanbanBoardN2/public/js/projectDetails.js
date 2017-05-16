const MAX_TASK_NUM = 5;

// initiation data for the project
var title = $('#project-title').text().trim();

/* Function definitions */

// Callback function after getProjectDetail ajax call succeed
var getProjectDetailSuccess = function(data, status) {
	var loaclProjectData = Object.assign( {}, data, {newStageTitle: ''} );
	var project = new Vue({
	  el: '#project-board',
	  data: loaclProjectData,
	  methods: {
	  	addStage: addStage.bind(null, loaclProjectData),
	  	showLog: showLog.bind(null, loaclProjectData),
	  	hideLog: hideLog
	  }
	})
}

var addStage = function(projectData) {
	// Verify all fields are filled.
	if (projectData.newStageTitle === '') {
		alert("Please fill in all fileds.");
		return;
	}

	// Verify there's no stage with the same title
	if (projectData.stageMap[projectData.newStageTitle] != undefined) {
		alert("This stage already exists!");
		return;
	}

	// Add responsive property!!!
	var tempStageMap = {};
	tempStageMap[projectData.newStageTitle] = { maxTaskNum: MAX_TASK_NUM, taskList: [] };
	projectData.stageMap = Object.assign( {}, projectData.stageMap, tempStageMap );

	// Make an ajax call to add a new stage
	$.post({
		type: "POST",
	  url: "/addStage/" + projectData.newStageTitle,
	  data: { projectTitle: projectData.title }
	})

	// Reset input field
	projectData.newStageTitle = '';
}

var showLog = function(projectData) {
	// Logs are recorded on server side. We need to sync log data from server before displaying logs
	$.post({
		type: "POST",
	  url: "/getProject/" + title,
	  success: function(data, status) {
	  	projectData.log = data.log;
	  	$('.center-content').hide();
			$('.log-history').show();
			$('#nav-home').toggleClass('active');
			$('#nav-log').toggleClass('active');
	  }
	})
}

var hideLog = function() {
	$('.center-content').show();
	$('.log-history').hide();
	$('#nav-home').toggleClass('active');
	$('#nav-log').toggleClass('active');
}

var initProjectDetails = function() {
	// Make an ajax call to get project data
	$.post({
		type: "POST",
	  url: "/getProject/" + title,
	  success: getProjectDetailSuccess
	})
}

// Component for each task card
Vue.component('task', {
	props: ['taskName', 'taskMap'],
	template: '<div class="task-card">\
    	<span>{{taskName}}</span>\
    	\
    	<div class="dropdown pull-right">\
        <button class="btn btn-default btn-xs dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
    			Actions\
    			<span class="caret"></span>\
  			</button>\
			  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">\
			    <li><a href="#" @click="removeTask">Remove task</a></li>\
			    <li><a href="#">Edit task</a></li>\
			  </ul>\
			</div><br><br><br>\
			\
			<div class="pull-right">\
			  <span>created by {{taskMap[taskName].requester}} </span>\
			</div><br>\
    </div>',
  methods: {
  	removeTask: function() {
  		// To decouple the parent and child component, we emit an removeTask event.
  		this.$emit('remove-task');
  	}
  }
})

// Component for each stage column
Vue.component('column', {
	props: ['stageName', 'stageMap', 'taskMap', 'log', 'project'],
	data: function () {
		// Vue component must have a function for data key. This data is for the new task.
		return {
			newTaskTitle: '',
			newTaskRequester: ''
		};
	},
	template: 
	 '<div class="col-md-2 stage-card">\
	 			<div class="remove-task-btn" v-if="stageMap[stageName].taskList.length === 0">\
			    <button type="button" class="btn btn-default btn-xs pull-right" @click="removeStage">\
				    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
				  </button>\
				</div>\
	      <h4>{{stageName}}\
	        <small class="pull-right">Task limit: {{stageMap[stageName].maxTaskNum}}({{stageMap[stageName].taskList.length}})</small>\
	      </h4>\
	      \
	      <div v-for="taskName in stageMap[stageName].taskList">\
	        <task :task-name="taskName" :task-map="taskMap" v-on:remove-task=removeTask(taskName)></task>\
	      </div>\
	      \
	      <div class="add-task-block">\
		      <p>Add a task: </p>\
		      <div><input type="text" class="add-task-input form-control" placeholder="Task title" v-model.trim="newTaskTitle" @keyup.enter="addTask"></div>\
		      <div><input type="text" class="add-task-input form-control" placeholder="Requester" v-model.trim="newTaskRequester" @keyup.enter="addTask"></div>\
		      <button class="add-task-btn btn btn-default pull-right" type="button" @click="addTask">Add</button>\
		    </div>\
	    </div>\
		</div>',
	methods: {
		addTask: function() {
			var stageValue = this.stageMap[this.stageName];

			// Verify all fields are filled.
			if (this.newTaskTitle === '' || this.newTaskRequester === '') {
				alert("Please fill in all fileds.");
				return;
			}

			// Verify kanban limit for current stage is not reached.
			if (stageValue.taskList.length === stageValue.maxTaskNum) {
				alert("Task limit reached. Cannot add more tasks.");
				return;
			}

			// We don't allow adding tasks with the same title
			for (var existTaskTitle in this.taskMap) {
				if (existTaskTitle === this.newTaskTitle) {
					alert("Task with the same title already exists.");
					return;
				}
			}

			// Add new task to global taskMap
			this.taskMap[this.newTaskTitle] = {
				requester: this.newTaskRequester,
				stage: this.stageName
			};

			// Add new task title to current stage taskList
			stageValue.taskList.push(this.newTaskTitle);

			$.post({
				type: "POST",
			  url: "/addTask/",
			  data: { 
			  	projectTitle: this.project.title,
			  	stageTitle: this.stageName,
			  	taskTitle: this.newTaskTitle,
			  	requester: this.newTaskRequester
			  }
			})

			// Reset input fields
			this.newTaskTitle = '';
			this.newTaskRequester = '';
		},
		removeTask: function(taskName) {
			var stageValue = this.stageMap[this.stageName];

			// Remove the task name from current stage
			for (var i in stageValue.taskList) {
				var currentTaskName = stageValue.taskList[i];
				if (taskName === currentTaskName) {
					stageValue.taskList.splice(i, 1);
					break;
				}
			}

			// Remove the task from taskMap
			delete this.taskMap[taskName];

			// Make ajax call to update server data
			$.post({
				type: "POST",
			  url: "/removeTask/",
			  data: {
			  	projectTitle: this.project.title,
			  	stageTitle: this.stageName,
			  	taskTitle: taskName
			  }
			})

		},
		removeStage: function() {
			// Use vm.$delete to make page responsive to the change
			this.$delete(this.stageMap, this.stageName);

			// Make ajax call to update server data
			$.post({
				type: "POST",
			  url: "/removeStage/" + this.stageName,
			  data: { projectTitle: this.project.title }
			})
		}
	}
})

// Page entry point
initProjectDetails();




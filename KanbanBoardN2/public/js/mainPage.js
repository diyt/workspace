// Callback function after getProjectDetail ajax call succeed
var getProjectsSuccess = function(data, status) {
// var projectNames = Object.assign( {}, data, {newStageTitle: ''} );
	var projects = generateLocalProjects(data);
	var mainApp = new Vue({
	  el: '#mainapp',
	  data: {
	    projects: projects,
      newProjectName: ''
    },
    methods: {
      submit: function() {
        if(this.newProjectName === '') {
          alert("Project name cannot be empty!");
          return;
        }

        for(var i in this.projects) {
          if(this.newProjectName === projects[i].title) {
            alert("Project " + this.newProjectName + " already exists!");
            return;
          }
        }

        var newProject = {
          title: this.newProjectName,
          link: "/projectDetail/" + this.newProjectName
        }

        this.projects.push(newProject);

        $('#add-project-modal').modal('toggle');

        $.post({
          type: "POST",
            url: "/addProject/" + this.newProjectName,
            success: addProjectSuccess
        })
      }
    }
	})
}

var addProjectSuccess = function(data) {

}

var generateLocalProjects = function(data) {
  var localProjects = [];
  for(var key in data) {
    var tempProject = {
      title: key,
      link: "/projectDetail/" + key
    }
    localProjects.push(tempProject);
  }
  return localProjects;
}

var initMainPage = function() {
 	// Make an ajax call to get project data
 	$.post({
 		type: "POST",
 	    url: "/getProjects/",
 	    success: getProjectsSuccess
 	})
 }


// Page entry point
 initMainPage();
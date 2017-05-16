// Use AWS SDK to access datebase
var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-2"
});
var docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "projects";
const MAX_TASK_NUM = 5;

var db = {
	getProjects: function(successCallback, failureCallback) {
		var params = {
			TableName: TABLE_NAME
		};
		docClient.scan(params, function(err, data) {
			if (err) {
					console.error("Unable to get projects data. Error JSON:", JSON.stringify(err, null, 2));
					failureCallback(err);
			} else {
					successCallback(data);
			}
		});
	},
	addProject: function(projectTitle) {
		var params = {
		  TableName:TABLE_NAME,
			Item:{
				"title": projectTitle,
				"stageMap": {},
				"taskMap":{},
				"log": ['Project "' + projectTitle + '" was created at ' + new Date()]
			}
		};
		docClient.put(params, function(err, data) {
			if (err) {
				console.error("Unable to add item. Error JSON: ", JSON.stringify(err, null, 2));
			} else {
				console.log("New project" + projectTitle + " was added successfully!");
			}
		});
	},
	addStage: function(projectTitle, stageTitle) {
		var params = {
			TableName:TABLE_NAME,
			Key:{
					"title": projectTitle,
			},
			UpdateExpression: "SET #L = list_append(#L, :nl), #SM.#ST = :ns",
			ExpressionAttributeNames: {
				"#L": "log",
				"#SM": "stageMap",
				"#ST": stageTitle
			},
			ExpressionAttributeValues:{
				":ns": {
					maxTaskNum: MAX_TASK_NUM,
					taskList: []
				},
				":nl": ['Stage "' + stageTitle + '" was created at ' + new Date()]
			}
		};
		docClient.update(params, function(err, data) {
			if (err) {
					console.error("Unable to update item. Error JSON: ", JSON.stringify(err, null, 2));
			} else {
					console.log("Stage was added successfully: ", JSON.stringify(data, null, 2));
			}
		});
	},
	removeStage: function(projectTitle, stageTitle) {
		var params = {
			TableName:TABLE_NAME,
			Key:{
					"title": projectTitle,
			},
			UpdateExpression: "SET #L = list_append(#L, :nl) REMOVE #SM.#ST",
			ExpressionAttributeNames: {
				"#L": "log",
				"#SM": "stageMap",
				"#ST": stageTitle
			},
			ExpressionAttributeValues:{
				":nl": ['Stage "' + stageTitle + '" was removed at ' + new Date()]
			}
		};
		docClient.update(params, function(err, data) {
			if (err) {
					console.error("Unable to update item. Error JSON: ", JSON.stringify(err, null, 2));
			} else {
					console.log("Stage was removed successfully: ", JSON.stringify(data, null, 2));
			}
		});
	},
	addTask: function(projectTitle, stageTitle, taskTitle, requester) {
		var params = {
			TableName:TABLE_NAME,
			Key:{
					"title": projectTitle,
			},
			UpdateExpression: "SET #L = list_append(#L, :nl),  #TM.#TT = :nt,  #SM.#ST.#TL = list_append(#SM.#ST.#TL, :ntn)",
			ExpressionAttributeNames: {
				"#L": "log",
				"#SM": "stageMap",
				"#TM": "taskMap",
				"#ST": stageTitle,
				"#TT": taskTitle,
				"#TL": "taskList"
			},
			ExpressionAttributeValues:{
				":nl": ['Task "' + taskTitle + '" was created at stage ' + stageTitle + ' at ' + new Date()],
				":nt": {
					"requester": requester,
					"stage": stageTitle
				},
				':ntn': [taskTitle]
			}
		};
		docClient.update(params, function(err, data) {
			if (err) {
					console.error("Unable to update item. Error JSON: ", JSON.stringify(err, null, 2));
			} else {
					console.log("Task was added successfully: ", JSON.stringify(data, null, 2));
			}
		});
	},
	removeTask: function(projectTitle, stageTitle, taskTitle, taskPositionInStageMap) {
		var params = {
			TableName:TABLE_NAME,
			Key:{
					"title": projectTitle,
			},
			UpdateExpression: "SET #L = list_append(#L, :nl)  REMOVE #TM.#TT, #SM.#ST.#TL[" + taskPositionInStageMap + "]",
			ExpressionAttributeNames: {
				"#L": "log",
				"#SM": "stageMap",
				"#TM": "taskMap",
				"#ST": stageTitle,
				"#TT": taskTitle,
				"#TL": "taskList"
			},
			ExpressionAttributeValues:{
				":nl": ['Task "' + taskTitle + '" was removed from stage ' + stageTitle + ' at ' + new Date()]
			}
		};
		docClient.update(params, function(err, data) {
			if (err) {
					console.error("Unable to update item. Error JSON: ", JSON.stringify(err, null, 2));
			} else {
					console.log("Task was removed successfully: ", JSON.stringify(data, null, 2));
			}
		});
	}
}

module.exports = db;
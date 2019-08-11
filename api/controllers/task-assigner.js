'use strict';

// task-assigner controller is the exposed API used to assign agents to a task and to update tasks 

const mongoose = require('mongoose');
const _ = require('lodash');

const Task = mongoose.model('Tasks');

var processError = function(err, res) {
  if (err) {
    res.status(404).send("Data was not found");
  }
};

var updateTaskAndSendResult = function(newTask, res) {
  Task.findOneAndUpdate({ _id: newTask.id }, newTask, { new: true }, function (err, updatedTask) {
    processError(err, res);
    res.json(updatedTask);
  });
};

exports.assign_to_agent = function (req, res) {
  //create a new task then distribute to an agent

  var newTask = new Task(req.body);
  var agentBestMatch;
  var allAgents = Agent.find({});
  var allSkilledAgents = _.filter(allAgents, function(agent) {
    //rule 1: agent must possess all skills required by the task
    return _.every(newTask.required_skills, function(taskSkill) {
      return agent.skills.contains(taskSkill);
    });
  });

  //rule 3: the system will always prefer an agent that is not assigned any task to an agent already assigned to a task.
  var allAgentsWithoutTask = _.filter(allSkilledAgents, function(agent) {
    return agent.hasNoTask;
  });

  if (allAgentsWithoutTask.length) {
    //rule 2: an agent cannot be assigned a task if they’re already working on a task of equal or higher priority.
    var allAgentsNotAlreadyOnTask = _.reject(allAgentsWithoutTask, function(agent) {
      return agent.task && agent.task.priority >= newTask.priority;
    });
  }
  else if (allAgentsWithoutTask.length) {
      //rule 4: if all agents are currently working on a lower priority task, the system will pick the agent that started working on his/her current task the most recently.
      var allAgentsSortedByTimestamp = _.sortBy(allSkilledAgents, ['priority', 'state.updated_at']);
  }

  if (allAgentsNotAlreadyOnTask.length) {
    agentBestMatch = _.sortBy(allAgentsNotAlreadyOnTask, 'priority')[0];
  }
  else if (allAgentsSortedByTimestamp.length) {
    agentBestMatch = allAgentsSortedByTimestamp[0];
  }
  else {
    //rule 5: if no agent is able to take the task, the service should return an error.
    return processError(true, res);
  }

  newTask.agents.push(agentBestMatch);
  updateTaskAndSendResult(newTask, res);
};

exports.mark_completed = function (req, res) {
  
  var id = req.params.taskId;
  var task = req.body;

  task.state.value = new TaskState({ value: 'completed'});
  updateTaskAndSendResult(task, res);
};

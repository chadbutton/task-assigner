'use strict';

// task-assigner controller is the exposed API used to assign agents to a task and to update tasks 

const mongoose = require('mongoose');
const _ = require('lodash');

const Task = mongoose.model('Tasks');
const Agent = mongoose.model('Agents');

var processError = function (err, res) {
  if (err) {
    res.status(404).send("Data was not found");
  }
};

var updateTaskAndSendResult = function (task, agent, res) {
  
  Task.findOneAndUpdate({ _id: task.id }, task, { new: true }, function (err, updatedTask) {
    processError(err, res);
    console.log('Task Assigner assigned an agent this task:', task)
    res.json({ task: task, agent: agent});
  });
};

exports.agentsWithAllSkillsFrom = function (agents, task) {

  return _.filter(agents, function (agent) {
    return _.every(task.required_skills, function (taskSkill) {
      return _.some(agent.skills, taskSkill);
    });
  });
};

exports.agentsWithNoTask = function (agents) {
  return _.filter(agents, function (agent) {
    return agent.hasNoTask;
  });
};

exports.excludeAgentsOnTaskWithHigherPriority = function (agents, task) {
  return _.reject(agents, function (agent) {
    return agent.task && agent.task.priority >= task.priority;
  });
};

exports.prioritizeAgentsByLowPriorityAndMostRecentStartTime = function (agents) {

  //note that all with task = null will be at the end because of task.priority
  return _.orderBy(agents, ['task.priority', 'task.updated_at'], ['asc', 'desc']);
};

exports.processAllAgents = function(agent) {

}

exports.assign_to_agent = function (req, res) {
  //endpoint to create a new task then distribute to an agent
  var self = exports;
  var newTask = new Task({name: "Answer a call"});
  var agentBestMatch;
  var allAgentsQuery = Agent.find({});

  console.log("Task Assigner assign_to_agent received task:", newTask);

  allAgentsQuery.exec(function (err, allAgents) {

    //rule 1: agent must possess all skills required by the task
    var allSkilledAgents = self.agentsWithAllSkillsFrom(allAgents, newTask);
    var allAgentsNotAlreadyOnTask, allAgentsSortedByTimestamp = [];

    console.log("Task Assigner assign_to_agent [rule 1] found agents with all required skills: ", allSkilledAgents.length);

    //rule 3: the system will always prefer an agent that is not assigned any task to an agent already assigned to a task.
    var allAgentsWithoutTask = self.agentsWithNoTask(allSkilledAgents);
    console.log("Task Assigner assign_to_agent [rule 3] found agents without a task: ", allAgentsWithoutTask.length);

    if (allAgentsWithoutTask.length) {
      //rule 2: an agent cannot be assigned a task if they’re already working on a task of equal or higher priority.
      allAgentsNotAlreadyOnTask = self.excludeAgentsOnTaskWithHigherPriority(allAgentsWithoutTask, newTask);
      console.log("Task Assigner assign_to_agent [rule 2] pruned agents based on current task priority:", allAgentsNotAlreadyOnTask.length);
    }
    else if (allSkilledAgents.length) {
      //rule 4: if all agents are currently working on a lower priority task, the system will pick the agent that started working on his/her current task the most recently.
      allAgentsSortedByTimestamp = self.prioritizeAgentsByLowPriorityAndMostRecentStartTime(allSkilledAgents);
      console.log("Task Assigner assign_to_agent [rule 4] prioritized agents based on most recent task:", allAgentsSortedByTimestamp.length);
    }

    if (allAgentsNotAlreadyOnTask && allAgentsNotAlreadyOnTask.length) {
      agentBestMatch = _.first(self.prioritizeAgentsByLowPriorityAndMostRecentStartTime(allAgentsNotAlreadyOnTask));
    }
    else if (allAgentsSortedByTimestamp && allAgentsSortedByTimestamp.length) {
      agentBestMatch = _.first(allAgentsSortedByTimestamp);
    }
    else {
      //rule 5: if no agent is able to take the task, the service should return an error.
      return processError(true, res);
    }

    newTask.agent = agentBestMatch;
    newTask.state = Task.States.Assigned;

    console.log("Task Assigner chose this agent as the best match: ", agentBestMatch);
    updateTaskAndSendResult(newTask, agentBestMatch, res);
  });

};

exports.mark_completed = function (req, res) {
  //endpoint to mark task as completed

  var id = req.params.taskId;
  Task.findById(id, function (err, task) {
    processError(err, res);

    if (task) {
      task.state = Task.States.Completed;
      updateTaskAndSendResult(task, task.agent, res);
    }
  });
};

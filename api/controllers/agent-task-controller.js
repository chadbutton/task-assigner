'use strict';

// task-assigner controller is the exposed API used to assign agents to a task and to update tasks 

const mongoose = require('mongoose');
const _ = require('lodash');

const Task = mongoose.model('Tasks');
const Agent = mongoose.model('Agents');

var processNotFoundError = function (err, res) {
  if (err) {
    res.status(404).send("Data was not found");
  }
};

var processBadRequestError = function (err, res) {
  if (err) {
    res.status(400).send("Data was not found");
  }
};

var updateTaskAndSendResult = function (task, agent, res) {

  Task.findOneAndUpdate({ _id: task.id }, task, { new: true }, function (err, updatedTask) {
    processNotFoundError(err, res);
    console.log('agent-task-controller assign_to_agent assigned an agent this task:', task)

    if (task && agent) {
      res.json({ task: task, agent: agent });
    }
    else if (task) {
      res.json({ task: task });
    }
    else if (agent) {
      res.json({ agent: agent });
    }
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

exports.assignTaskToAgent = function (res, task, allAgents) {

  var self = exports;
  var agentBestMatch;

  //rule 1: agent must possess all skills required by the task
  var allSkilledAgents = self.agentsWithAllSkillsFrom(allAgents, task);
  var allAgentsNotAlreadyOnTask, allAgentsSortedByTimestamp = [];

  console.log("agent-task-controller assign_to_agent [rule 1] found agents with all required skills: ", allSkilledAgents.length);

  //rule 3: the system will always prefer an agent that is not assigned any task to an agent already assigned to a task.
  var allAgentsWithoutTask = self.agentsWithNoTask(allSkilledAgents);
  console.log("agent-task-controller assign_to_agent [rule 3] found agents without a task: ", allAgentsWithoutTask.length);

  if (allAgentsWithoutTask.length) {
    //rule 2: an agent cannot be assigned a task if they’re already working on a task of equal or higher priority.
    allAgentsNotAlreadyOnTask = self.excludeAgentsOnTaskWithHigherPriority(allAgentsWithoutTask, task);
    console.log("agent-task-controller assign_to_agent [rule 2] pruned agents based on current task priority:", allAgentsNotAlreadyOnTask.length);
  }
  else if (allSkilledAgents.length) {
    //rule 4: if all agents are currently working on a lower priority task, the system will pick the agent that started working on his/her current task the most recently.
    allAgentsSortedByTimestamp = self.prioritizeAgentsByLowPriorityAndMostRecentStartTime(allSkilledAgents);
    console.log("agent-task-controller assign_to_agent [rule 4] prioritized agents based on most recent task:", allAgentsSortedByTimestamp.length);
  }

  if (allAgentsNotAlreadyOnTask && allAgentsNotAlreadyOnTask.length) {
    agentBestMatch = _.first(self.prioritizeAgentsByLowPriorityAndMostRecentStartTime(allAgentsNotAlreadyOnTask));
  }
  else if (allAgentsSortedByTimestamp && allAgentsSortedByTimestamp.length) {
    agentBestMatch = _.first(allAgentsSortedByTimestamp);
  }
  else {
    //rule 5: if no agent is able to take the task, the service should return an error.
    return processNotFoundError(true, res);
  }

  task.agent = agentBestMatch;
  task.state = Task.States.Assigned;
  agentBestMatch.task = task;

  console.log("agent-task-controller assign_to_agent chose this agent as the best match: ", agentBestMatch);
  updateTaskAndSendResult(task, agentBestMatch, res);
}

exports.assign_to_agent = function (req, res) {
  //endpoint to create a new task then distribute to an agent

  if (req.query.name == null || req.query.name == '') {
    return processBadRequestError(true, res);
  }

  var newTask = new Task({ name: req.query.name});
  var allAgentsQuery = Agent.find({});

  console.log("agent-task-controller assign_to_agent received task:", newTask);

  allAgentsQuery.exec(function (err, allAgents) {
    exports.assignTaskToAgent(res, newTask, allAgents);
  });
};

exports.mark_completed = function (req, res) {
  //endpoint to mark task as completed

  var id = req.params.taskId;

  Task.findById(id, function (err, task) {
    
    if (err) {
      return processNotFoundError(err, res);
    }

    if (task && task.state == Task.States.Idle) {
      console.log("agent-task-controller mark_completed found task:", task);
      task.state = Task.States.Completed;
      updateTaskAndSendResult(task, null, res);
    }
    else {
      processNotFoundError(true, res);
    }
  });
};

exports.all_agents = function (req, res) {
  var allAgentsQuery = Agent.find().populate('tasks');

  allAgentsQuery.exec(async function (err, allAgents) {
    console.log("agent-task-controller all_agents found agents:", allAgents.length);
    res.json({ agents: allAgents });
  });
}


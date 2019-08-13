'use strict';

// agent controller is the exposed API used for REST operations on an agent 

const mongoose = require('mongoose');
const Agent = mongoose.model('Agents');
const Task = mongoose.model('Tasks');
const _ = require('lodash');

exports.all_agents = function(req, res) {
    var allAgentsQuery = Agent.find().populate('tasks');
  
    allAgentsQuery.exec(async function (err, allAgents) {
        res.json({agents: allAgents});
    });
  }
  
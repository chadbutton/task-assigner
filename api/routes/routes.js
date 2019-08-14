'use strict';

const config = require('config');
const { assign_to_agent, mark_completed, all_agents } = require('../controllers/agent-task-controller');

module.exports = function (app) {
  
  app.route('/')
    .get(function(req, res) {
      res.status(200).send(config.get("app.title") + " is Running.");
    });

  app.route('/api/v1/tasks/assign-to-agent')
    .post(assign_to_agent);

  app.route('/api/v1/tasks/:taskId/mark-completed')
    .post(mark_completed);

  app.route('/api/v1/agents')
    .get(all_agents);

  //catch all
  app.get('*', function (req, res) {
    res.status(404).send(config.get('app.messages.invalidRoute'));
  });
};
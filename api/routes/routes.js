'use strict';

const config = require('config');
const { assign_to_agent, mark_completed } = require('../controllers/task-assigner');

module.exports = function (app) {
  
  app.route('/tasks/assign-to-agent')
    .post(assign_to_agent);

  app.route('/tasks/:taskId/mark-completed')
    .post(mark_completed);

  //catch all
  app.get('*', function (req, res) {
    res.status(404).send(config.get('app.messages.invalidRoute'));
  });
};
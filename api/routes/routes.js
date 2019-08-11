'use strict';

const config = require('config');

module.exports = function (app) {
  const taskAssigner = require('../controllers/task-assigner');

  app.route('/tasks/:taskId/assign-to-agent')
    .post(taskAssigner.assign_to_agent);

  app.route('/tasks/:taskId/mark-completed')
    .post(taskAssigner.mark_completed);

  //catch all
  app.get('*', function (req, res) {
    res.status(404).send(config.get('app.messages.invalidRoute'));
  });
};
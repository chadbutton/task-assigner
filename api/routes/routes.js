'use strict';

const config = require('config');

module.exports = function(app) {
  const agents = require('../controllers/agents');
  const tasks = require('../controllers/tasks');

  //agent routes
  app.route('/agents')
    .get(agents.list_all_agents)
    .post(agents.create_an_agent);

  app.route('/agents/:agentId')
    .get(agents.read_an_agent)
    .put(agents.update_an_agent)
    .delete(agents.delete_an_agent);

  //task routes
  app.route('/tasks')
    .get(tasks.list_all_tasks)
    .post(tasks.create_a_task);

  app.route('/tasks/:taskId')
    .get(tasks.read_a_task)
    .put(tasks.update_a_task)
    .delete(tasks.delete_a_task);

  //catch all
  app.get('*', function(req, res){
    res.status(404).send(config.get('app.messages.invalidRoute'));
  });
};
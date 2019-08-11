const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');

const agent = require('./api/models/agent');
const task = require('./api/models/task'); 
const agentSkill = require('./api/models/agent-skill'); 
const routes = require('./api/routes/routes');

mongoose.Promise = global.Promise;
mongoose.connect(config.get('database.path'), { useNewUrlParser: true, useFindAndModify: false }); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


routes(app);

module.exports = app;
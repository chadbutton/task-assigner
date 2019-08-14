const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const agent = require('./api/models/agent');
const task = require('./api/models/task'); 
const routes = require('./api/routes/routes');

const dbPath = "mongodb://" + config.get("database.host") + "/" + config.get('database.name');

console.log("Attempting to connect to mondodb: ", dbPath);
mongoose.connect(dbPath, { useNewUrlParser: true, useFindAndModify: false }); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

module.exports = app;
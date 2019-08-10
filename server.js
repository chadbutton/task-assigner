const express = require('express');
const app = express();
const config = require('config');
const port = process.env.PORT || config.get('app.port');
const mongoose = require('mongoose');
const agent = require('./api/models/agent');
const task = require('./api/models/task'); 
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(config.get('database.path'), { useNewUrlParser: true }); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/routes');
routes(app);

app.listen(port);

console.log('Task Assigner RESTful API server started on port: ' + port);

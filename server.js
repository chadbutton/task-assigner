const app = require("./app");
const config = require('config');
const port = process.env.PORT || config.get('app.port');

app.listen(port);
console.log('Task Assigner RESTful API server started on port: ' + port);

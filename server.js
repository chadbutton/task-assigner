const app = require("./app");
const config = require('config');
const port = process.env.PORT || config.get('app.port');
const simDataFactory = require('./api/data/sim-data-factory');

simDataFactory.regenerateAllFakeDBData().then(function() {
    app.listen(port);
    console.log(config.get('app.title') + ' service started on port: ' + port);
});


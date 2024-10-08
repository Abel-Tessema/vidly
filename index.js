const express = require('express');
const app = express();
const logger = require('./logger');

require('./startup/logging')();
require('./startup/validation')();
require('./startup/production')(app);
require('./startup/database')();
require('./startup/routes')(app);
require('./startup/config')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;
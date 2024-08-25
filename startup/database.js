const mongoose = require("mongoose");
const logger = require('../logger');
const config = require('config');

function databaseInit() {
  const db = config.get('db');
  mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${db}...`));
}

module.exports = databaseInit;
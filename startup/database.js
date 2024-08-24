const mongoose = require("mongoose");
const logger = require('../logger');

function databaseInit() {
  mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => logger.info('Connected to MongoDB...'));
}

module.exports = databaseInit;
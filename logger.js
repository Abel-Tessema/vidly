const winston = require("winston");
// require('winston-mongodb');
const {format, transports} = require("winston");
const {combine, timestamp, printf, errors, metadata, json} = format;

const logger = winston.createLogger({
  level: 'error',
  format: combine(
    errors({stack: true}),
    timestamp(),
    printf(({level, message, timestamp, stack}) =>
      `${timestamp} ${level}: ${message} ${stack ? stack : ''}` // For it to be formatted like this, you have to remove `format: json()`
    ),
    metadata(),
  ),
  transports: [
    new transports.Console({level: 'info'}),
    new transports.File({filename: 'logFile.log', format: json()}),
    // new transports.MongoDB({
    //   db: 'mongodb://localhost/vidly',
    //   options: {useUnifiedTopology: true},
    // })
  ]
});

module.exports = logger;
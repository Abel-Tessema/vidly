const logger = require("../logger");
require('express-async-errors');

function logging() {
  process.on('uncaughtException', (e) => {
    console.error('We\'ve got an uncaught exception.');
    logger.error(e);
    logger.on('finish', () => process.exit(1));
    logger.end();
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('We\'ve got an unhandled rejection.');
    logger.error(reason);
    logger.on('finish', () => process.exit(1));
    logger.end();
  });
}

module.exports = logging;
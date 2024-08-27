const helmet = require('helmet');
const compression = require('compression');

function production(app) {
  app.use(helmet());
  app.use(compression());
}

module.exports = production;
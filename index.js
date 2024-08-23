const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
require('express-async-errors');
const logger = require('./logger');

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

Joi.preferences({abortEarly: false});
Joi.objectId = require('joi-objectid')(Joi);

// throw new Error('Something went wrong during startup.');

// Promise.reject(new Error('Something went sideways.'));

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const error = require('./middleware/error');

if (!config.get('jwtSecretKey')) {
  console.error('FATAL ERROR: jwtSecretKey is not defined.');
  process.exit(1);
}

const app = express();

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.error('Could not connect to MongoDB.', error.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
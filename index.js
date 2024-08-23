const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const {format} = require("winston");
const {combine, timestamp, printf} = format;

Joi.preferences({abortEarly: false});
Joi.objectId = require('joi-objectid')(Joi);

winston.add(new winston.transports.File({filename: 'logFile.log'}));
winston.add(new winston.transports.MongoDB({
  db: 'mongodb://localhost/vidly',
  options: {useUnifiedTopology: true},
  level: 'error',
  format: combine(
    format.errors({stack: true}), // log the full stack
    timestamp(), // get the time stamp part of the full log message
    printf(({level, message, timestamp, stack}) => {
      // formating the log outcome to show/store
      return `${timestamp} ${level}: ${message} - ${stack}`;
    }),
    format.metadata() // >>>> ADD THIS LINE TO STORE the ERR OBJECT IN META field
  ),
}));

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
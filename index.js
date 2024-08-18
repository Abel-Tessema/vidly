const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');

Joi.preferences({abortEarly: false});

const app = express();

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.error('Could not connect to MongoDB.', error.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
const express = require('express');
const Joi = require('joi');

const genres = require('./routes/genres');

Joi.preferences({abortEarly: false});

const app = express();

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
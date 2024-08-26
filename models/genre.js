const Joi = require("joi");
const mongoose = require("mongoose");

const minCharacters = 3;
const maxCharacters = 50;

const genreSchemaJoi = Joi.object({
  name: Joi.string().required().min(minCharacters).max(maxCharacters).trim(),
});

const genreSchemaMongoose = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: minCharacters,
    maxlength: maxCharacters,
    trim: true,
    validate: {
      validator: function(value) {
        return (value) && (value.length >= minCharacters) && (value.length <= maxCharacters);
      },
      message: 'A genre needs a name that is 3 to 50 characters long.'
    }
  }
});

const Genre = mongoose.model('Genre', genreSchemaMongoose);

module.exports.genreSchema = genreSchemaJoi; // Joi, for validation
module.exports.genreSchemaMongoose = genreSchemaMongoose; // Mongoose, for embedding documents
module.exports.Genre = Genre;
const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchemaJoi = Joi.object({
  name: Joi.string().required().min(3).max(255).trim(),
});

const genreSchemaMongoose = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    validate: {
      validator: function(value) {
        return (value) && (value.length >= 3) && (value.length <= 32);
      },
      message: 'A genre needs a name that is 3 to 32 characters long.'
    }
  }
});

const Genre = mongoose.model('Genre', genreSchemaMongoose);

module.exports.genreSchema = genreSchemaJoi; // Joi, for validation
module.exports.genreSchemaMongoose = genreSchemaMongoose; // Mongoose, for embedding documents
module.exports.Genre = Genre;
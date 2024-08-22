const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = Joi.object({
  customerId: Joi.string().required().length(24),
  movieId: Joi.string().required().length(24)
});

const rentalSchemaMongoose = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      name: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
      isGold: {type: Boolean, required: true, default: false},
      phone: {type: String, required: true}
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      title: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
      dailyRentalRate: {type: Number, required: true, min: 0, max: 255, default: 0}
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model('Rental', rentalSchemaMongoose);

module.exports.rentalSchema = rentalSchema; // Joi, for validation
module.exports.rentalSchemaMongoose = rentalSchemaMongoose; // Mongoose, for embedding documents
module.exports.Rental = Rental;
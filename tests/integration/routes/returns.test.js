/*
 * POST /api/returns {customerId, movieId}
 *
 * return a 401 status if the client is not logged in
 * return a 400 status if customerId is not provided
 * return a 400 status if movieId is not provided
 * return a 404 status if there\'s no rental with the given customerId and movieId
 * return a 400 status if the rental is already processed
 * return a 200 status if it\'s a valid request
 * set the return date
 * calculate the rental fee
 * increase the movie\'s stock
 * return the rental object
 */

let server;
require('../../../startup/validation')();
const {Rental} = require('../../../models/rental');
const mongoose = require("mongoose");
const request = require('supertest');

describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;
  
  beforeEach(async () => {
    server = require('../../../index');
    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();
    
    rental = new Rental({
      customer: {_id: customerId, name: 'Name 1', phone: '12345'},
      movie: {_id: movieId, title: 'Movie 1', dailyRentalRate: 3}
    });
    
    await rental.save();
  });
  
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany();
  });
  
  const exec = () => {
    return request(server)
      .post('/api/returns')
      .send({customerId, movieId});
  };
  
  it('return a 401 status if the client is not logged in', async () => {
    const response = await exec();
    expect(response.status).toBe(401);
  });
});
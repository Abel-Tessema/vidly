/*
 * POST /api/returns {customerId, movieId}
 *
 * return a 401 status if the client is not logged in *
 * return a 400 status if customerId is not provided *
 * return a 400 status if movieId is not provided *
 * return a 404 status if there's no rental with the given customerId and movieId
 * return a 400 status if the rental is already processed
 * return a 201 status if it's a valid request
 * set the return date
 * calculate the rental fee (numberOfDays * movie.dailyRentalRate)
 * increase the movie's stock
 * return the rental object
 */

let server;
require('../../../startup/validation')();
const {Rental} = require('../../../models/rental');
const mongoose = require("mongoose");
const request = require('supertest');
const {User} = require("../../../models/user");
const {Movie} = require("../../../models/movie");

describe('/api/returns', () => {
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;
  
  beforeEach(async () => {
    server = require('../../../index');
    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();
    token = new User().generateAuthToken();
    
    rental = new Rental({
      customer: {_id: customerId, name: 'Name 1', phone: '12345'},
      movie: {_id: movieId, title: 'Movie 1', dailyRentalRate: 2}
    });
    await rental.save();
    
    movie = new Movie({
      _id: movieId,
      title: 'Movie 1',
      genre: {name: 'Genre 1'},
      numberInStock: 5,
      dailyRentalRate: 2
    });
    await movie.save();
  });
  
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany();
    await Movie.deleteMany();
  });
  
  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({customerId, movieId});
  };
  
  it('should return a 401 status if the client is not logged in', async () => {
    token = '';
    const response = await exec();
    expect(response.status).toBe(401);
  });
  
  it('should return a 400 status if customerId is not provided', async () => {
    customerId = '';
    const response = await exec();
    expect(response.status).toBe(400);
  });
  
  it('should return a 400 status if movieId is not provided', async () => {
    movieId = '';
    const response = await exec();
    expect(response.status).toBe(400);
  });
  
  it('should return a 404 status if there\'s no rental with the given customerId and movieId', async () => {
    await Rental.deleteMany(); // Because a rental is created in beforeEach().
    const response = await exec();
    expect(response.status).toBe(404);
  });
  
  it('should return a 400 status if the return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const response = await exec();
    expect(response.status).toBe(400);
  });
  
  it('should return a 201 status if it\'s a valid request', async () => {
    const response = await exec();
    expect(response.status).toBe(201);
  });
  
  it('should set the return date if it\'s a valid request', async () => {
    await exec();
    rental = await Rental.findById(rental._id); // Because it gets modified as part of posting the movie return.
    const timeDifference = new Date() - rental.dateReturned;
    expect(timeDifference).toBeLessThan(10_000); // 10 seconds
  });
  
  it('should calculate the rental fee if it\'s a valid request', async () => {
    const sevenDaysInMilliseconds = 7 * 1_000 * 60 * 60 * 24;
    rental.dateOut = new Date() - sevenDaysInMilliseconds; // To make it seven days ago.
    await rental.save();
    await exec();
    rental = await Rental.findById(rental._id);
    expect(rental.rentalFee).toBeGreaterThanOrEqual(rental.movie.dailyRentalRate);
    expect(rental.rentalFee).toBeCloseTo(14);
  });
  
  it('should increase the movie\'s stock if it\'s a valid request', async () => {
    const initialStock = movie.numberInStock;
    await exec();
    movie = await Movie.findById(movieId);
    const finalStock = movie.numberInStock;
    expect(finalStock).toBe(initialStock + 1);
  });
  
  it('should return the rental object if it\'s a valid request', async () => {
    const response = await exec();
    /*
    expect(response.body).toHaveProperty('customer');
    expect(response.body).toHaveProperty('movie');
    expect(response.body).toHaveProperty('dateOut');
    expect(response.body).toHaveProperty('dateReturned');
    expect(response.body).toHaveProperty('rentalFee');
    */
    
    expect(Object.keys(response.body))
      .toEqual(expect.arrayContaining(
        ['customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee']
      ));
  });
});
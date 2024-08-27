let server;
const request = require('supertest');
const {User} = require("../../../models/user");
const {Genre} = require("../../../models/genre");

describe('auth middleware', () => {
  beforeEach(() => server = require('../../../index'));
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany();
  });
  
  let token;
  
  const exec = async () => {
    return await request(server)
      .post('/api/genres') // Just choosing one random route that needs authorization
      .set('x-auth-token', token)
      .send({name: 'Genre 1'});
  }
  
  beforeEach(() => token = new User().generateAuthToken());
  
  it('should return a 401 status if no token is provided', async () => {
    token = '';
    const response = await exec();
    expect(response.status).toBe(401);
  });
  
  it('should return a 201 status if the token is valid', async () => {
    const response = await exec();
    expect(response.status).toBe(201); // Since we created a genre.
  });
});
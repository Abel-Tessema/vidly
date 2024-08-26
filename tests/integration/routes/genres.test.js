let server;
const request = require('supertest');
const {Genre} = require('../../../models/genre');
const {User} = require("../../../models/user");

describe('/api/genres', () => {
  beforeEach(() => server = require('../../../index'));
  afterEach(async () => {
    server.close();
    await Genre.deleteMany();
  });
  
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        {name: 'Genre 1'},
        {name: 'Genre 2'}
      ]);
      
      const response = await request(server).get('/api/genres');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(genre => genre.name === 'Genre 1')).toBeTruthy();
      expect(response.body.some(genre => genre.name === 'Genre 2')).toBeTruthy();
    });
  });
  
  describe('GET /:id', () => {
    it('should return a genre if a valid id is passed', async () => {
      const genre = new Genre({name: 'Genre 1'});
      await genre.save();
      const response = await request(server).get(`/api/genres/${genre._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', genre.name);
    });
    
    it('should return a 404 status if an invalid id is passed', async () => {
      const response = await request(server).get('/api/genres/1');
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /', () => {
    /*
     * Define the happy path.
     * In each test, change one parameter.
     * That change should clearly align with the name of the test.
     */
    let token;
    let name;
    
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'Genre 1';
    });
    
    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name});
    }
    
    it('should return a 401 status if the client is not logged in', async () => {
      token = '';
      const response = await request(server).post('/api/genres').send({name: 'Genre 1'});
      expect(response.status).toBe(401);
    });
    
    it('should return a 400 status if the genre\'s name has less than 3 characters', async () => {
      name = 'G';
      const response = await exec();
      expect(response.status).toBe(400);
    });
  
    it('should return a 400 status if the genre\'s name has more than 50 characters', async () => {
      name = new Array(52).join('a'); // To generate a string which is 51 characters long.
      const response = await exec();
      expect(response.status).toBe(400);
    });
    
    it('should save the genre if it is valid', async () => {
      await exec();
      const genre = await Genre.find({name});
      expect(genre).not.toBeNull();
    });
    
    it('should return the genre if it is valid', async () => {
      const response = await exec();
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({name: name});
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', name);
    });
  });
});
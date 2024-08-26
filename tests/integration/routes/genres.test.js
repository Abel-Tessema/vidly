let server;
const request = require('supertest');
const {Genre} = require('../../../models/genre');

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
});
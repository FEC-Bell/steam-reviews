const request = require('supertest');
const { app, server } = require('../../server/index');

process.env.PORT = 6666;

export const routesTest = () => describe('/api/reviews/:gameid should return the correct data shape', () => {
  afterAll(async (done) => {
    await server.close();
    done();
  });

  test('Basic GET request', async (done) => {
    return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(2);
      })
      .then(() => done());
  });
});
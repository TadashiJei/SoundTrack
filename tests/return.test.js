const request = require('supertest');
const { app } = require('../server');
const Return = require('../models/Return');
const { generateTestToken } = require('./setup');

let token;

beforeAll(async () => {
  token = generateTestToken();
});

beforeEach(async () => {
  await Return.deleteMany({});
});

describe('Return API', () => {
  it('should create a new return', async () => {
    const res = await request(app)
      .post('/returns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: ['Item 1', 'Item 2'],
        condition: 'Good',
        notes: 'Test notes'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all returns', async () => {
    const testReturn = new Return({
      items: ['Item 1'],
      condition: 'Good',
      notes: 'Test'
    });
    await testReturn.save();

    const res = await request(app)
      .get('/returns')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single return', async () => {
    const returnItem = new Return({
      items: ['Item 1'],
      condition: 'Good',
      notes: 'Test'
    });
    await returnItem.save();

    const res = await request(app)
      .get(`/returns/${returnItem._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(returnItem._id.toString());
  });

  it('should update a return', async () => {
    const returnItem = new Return({
      items: ['Item 1'],
      condition: 'Good',
      notes: 'Test'
    });
    await returnItem.save();

    const res = await request(app)
      .patch(`/returns/${returnItem._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        condition: 'Damaged'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.condition).toEqual('Damaged');
  });
});
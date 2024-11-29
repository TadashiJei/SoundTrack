const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../server');
const CheckIn = require('../models/CheckIn');
const { generateTestToken } = require('./setup');

let token;

beforeAll(() => {
  token = generateTestToken();
});

// Clean up data before tests
beforeEach(async () => {
  await CheckIn.deleteMany({});
});

describe('Check-In API', () => {
  it('should create a new check-in', async () => {
    const res = await request(server)
      .post('/checkIns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: ['Item 1', 'Item 2'],
        status: 'Pending',
        condition: 'Good',
        location: 'Warehouse A'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all check-ins', async () => {
    const testCheckIn = new CheckIn({
      items: ['Item 1'],
      status: 'Pending',
      condition: 'Good',
      location: 'Warehouse A'
    });
    await testCheckIn.save();

    const res = await request(server)
      .get('/checkIns')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single check-in', async () => {
    const checkIn = new CheckIn({
      items: ['Item 1'],
      status: 'Pending',
      condition: 'Good',
      location: 'Warehouse A'
    });
    await checkIn.save();

    const res = await request(server)
      .get(`/checkIns/${checkIn._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(checkIn._id.toString());
  });

  it('should update a check-in', async () => {
    const checkIn = new CheckIn({
      items: ['Item 1'],
      status: 'Pending',
      condition: 'Good',
      location: 'Warehouse A'
    });
    await checkIn.save();

    const res = await request(server)
      .patch(`/checkIns/${checkIn._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        condition: 'Damaged'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.condition).toEqual('Damaged');
  });
});
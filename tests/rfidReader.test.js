const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../server');
const RFIDReader = require('../models/RFIDReader');
const { generateTestToken } = require('./setup');

let token;

beforeAll(() => {
  token = generateTestToken();
});

// Clean up data before tests
beforeEach(async () => {
  await RFIDReader.deleteMany({});
});

describe('RFID Reader API', () => {
  it('should create a new RFID reader', async () => {
    const res = await request(server)
      .post('/rfidReaders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Reader 1',
        location: 'Location 1',
        status: 'Active'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all RFID readers', async () => {
    const testReader = new RFIDReader({
      name: 'Reader 1',
      location: 'Location 1',
      status: 'Active'
    });
    await testReader.save();

    const res = await request(server)
      .get('/rfidReaders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single RFID reader', async () => {
    const reader = new RFIDReader({
      name: 'Reader 1',
      location: 'Location 1',
      status: 'Active'
    });
    await reader.save();

    const res = await request(server)
      .get(`/rfidReaders/${reader._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(reader._id.toString());
  });

  it('should update a RFID reader', async () => {
    const reader = new RFIDReader({
      name: 'Reader 1',
      location: 'Location 1',
      status: 'Active'
    });
    await reader.save();

    const res = await request(server)
      .patch(`/rfidReaders/${reader._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Inactive'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Inactive');
  });

  it('should delete a RFID reader', async () => {
    const reader = new RFIDReader({
      name: 'Reader 1',
      location: 'Location 1',
      status: 'Active'
    });
    await reader.save();

    const res = await request(server)
      .delete(`/rfidReaders/${reader._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Deleted RFID Reader');
  });
});
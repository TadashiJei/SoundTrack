const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../server');
const Preparation = require('../models/Preparation');

beforeAll(async () => {
  await Preparation.deleteMany({});
});

describe('Preparation API', () => {
  it('should create a new preparation', async () => {
    const res = await request(server)
      .post('/preparations')
      .send({
        items: ['Item 1', 'Item 2'],
        status: 'Pending',
        notes: 'Test notes'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all preparations', async () => {
    const res = await request(server).get('/preparations');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single preparation', async () => {
    const preparation = new Preparation({
      items: ['Item 1', 'Item 2'],
      status: 'Pending',
      notes: 'Test notes'
    });
    await preparation.save();

    const res = await request(server).get(`/preparations/${preparation._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(preparation._id.toString());
  });

  it('should update a preparation', async () => {
    const preparation = new Preparation({
      items: ['Item 1', 'Item 2'],
      status: 'Pending',
      notes: 'Test notes'
    });
    await preparation.save();

    const res = await request(server)
      .patch(`/preparations/${preparation._id}`)
      .send({
        status: 'Completed'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Completed');
  });

  it('should delete a preparation', async () => {
    const preparation = new Preparation({
      items: ['Item 1', 'Item 2'],
      status: 'Pending',
      notes: 'Test notes'
    });
    await preparation.save();

    const res = await request(server).delete(`/preparations/${preparation._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Deleted Preparation');
  });
});
const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../server');
const Dispatch = require('../models/Dispatch');

beforeAll(async () => {
  await Dispatch.deleteMany({});
});

describe('Dispatch API', () => {
  it('should create a new dispatch', async () => {
    const res = await request(server)
      .post('/dispatches')
      .send({
        order: { id: 'Order 1' },
        items: ['Item 1', 'Item 2'],
        status: 'Pending'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all dispatches', async () => {
    const res = await request(server).get('/dispatches');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single dispatch', async () => {
    const dispatch = new Dispatch({
      order: { id: 'Order 1' },
      items: ['Item 1', 'Item 2'],
      status: 'Pending'
    });
    await dispatch.save();

    const res = await request(server).get(`/dispatches/${dispatch._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(dispatch._id.toString());
  });

  it('should update a dispatch', async () => {
    const dispatch = new Dispatch({
      order: { id: 'Order 1' },
      items: ['Item 1', 'Item 2'],
      status: 'Pending'
    });
    await dispatch.save();

    const res = await request(server)
      .patch(`/dispatches/${dispatch._id}`)
      .send({
        status: 'Completed'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Completed');
  });

  it('should delete a dispatch', async () => {
    const dispatch = new Dispatch({
      order: { id: 'Order 1' },
      items: ['Item 1', 'Item 2'],
      status: 'Pending'
    });
    await dispatch.save();

    const res = await request(server).delete(`/dispatches/${dispatch._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Deleted Dispatch');
  });
});
const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('../server');
const Settings = require('../models/Settings');
const { generateTestToken } = require('./setup');

let token;

beforeAll(() => {
  token = generateTestToken();
});

// Clean up data before tests
beforeEach(async () => {
  await Settings.deleteMany({});
});

describe('Settings API', () => {
  it('should create a new setting', async () => {
    const res = await request(server)
      .post('/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ftpConfig: { host: 'ftp.example.com' },
        serverSettings: { port: 3000 },
        emailConfig: { smtp: 'smtp.example.com' },
        credentials: { username: 'user', password: 'pass' }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all settings', async () => {
    const testSetting = new Settings({
      ftpConfig: { host: 'ftp.example.com' },
      serverSettings: { port: 3000 },
      emailConfig: { smtp: 'smtp.example.com' },
      credentials: { username: 'user', password: 'pass' }
    });
    await testSetting.save();

    const res = await request(server)
      .get('/settings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single setting', async () => {
    const setting = new Settings({
      ftpConfig: { host: 'ftp.example.com' },
      serverSettings: { port: 3000 },
      emailConfig: { smtp: 'smtp.example.com' },
      credentials: { username: 'user', password: 'pass' }
    });
    await setting.save();

    const res = await request(server)
      .get(`/settings/${setting._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(setting._id.toString());
  });

  it('should update a setting', async () => {
    const setting = new Settings({
      ftpConfig: { host: 'ftp.example.com' },
      serverSettings: { port: 3000 },
      emailConfig: { smtp: 'smtp.example.com' },
      credentials: { username: 'user', password: 'pass' }
    });
    await setting.save();

    const res = await request(server)
      .patch(`/settings/${setting._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        serverSettings: { port: 4000 }
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.serverSettings.port).toEqual(4000);
  });

  it('should delete a setting', async () => {
    const setting = new Settings({
      ftpConfig: { host: 'ftp.example.com' },
      serverSettings: { port: 3000 },
      emailConfig: { smtp: 'smtp.example.com' },
      credentials: { username: 'user', password: 'pass' }
    });
    await setting.save();

    const res = await request(server)
      .delete(`/settings/${setting._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Deleted Setting');
  });
});
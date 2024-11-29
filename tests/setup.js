const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server, connectDB } = require('../server');

let mongoServer;

// Setup function
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await connectDB(mongoUri);

  // Create a test server
  const port = 0; // Let the OS assign a random port
  await new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Test server running on port ${server.address().port}`);
      resolve();
    });
  });
});

// Cleanup function
afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Helper function to generate test token
const generateTestToken = () => {
  return jwt.sign(
    { userId: 'test-user-id', role: 'admin' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

module.exports = { generateTestToken };

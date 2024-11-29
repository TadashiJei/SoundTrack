const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rfidReaderRoutes = require('./routes/rfidReader');
const settingsRoutes = require('./routes/settings');
const preparationRoutes = require('./routes/preparation');
const dispatchRoutes = require('./routes/dispatch');
const returnRoutes = require('./routes/return');
const checkInRoutes = require('./routes/checkIn');
const errorHandler = require('./middleware/errorHandler');
const socketIO = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Dynamic auth middleware import based on environment
const getAuthMiddleware = () => {
  if (process.env.NODE_ENV === 'test') {
    return require('./tests/mocks/authMiddleware');
  }
  return require('./middleware/authMiddleware');
};

const { authenticateToken, checkRole } = getAuthMiddleware();

// Routes
app.use('/rfidReaders', authenticateToken, checkRole('admin'), rfidReaderRoutes);
app.use('/settings', authenticateToken, checkRole('admin'), settingsRoutes);
app.use('/preparations', authenticateToken, preparationRoutes);
app.use('/dispatches', authenticateToken, dispatchRoutes);
app.use('/returns', authenticateToken, returnRoutes);
app.use('/checkIns', authenticateToken, checkInRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// MongoDB Connection
const connectDB = async (uri) => {
  try {
    const mongoUri = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/rfid-integration';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Only create server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 3005;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

module.exports = { app, server, connectDB };
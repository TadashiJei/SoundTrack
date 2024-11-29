const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  ftpConfig: {
    type: Object,
    required: true
  },
  serverSettings: {
    type: Object,
    required: true
  },
  credentials: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
// Compare this snippet from rfid-integration-backend/models/Preparation.js:
const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('CheckIn', checkInSchema);
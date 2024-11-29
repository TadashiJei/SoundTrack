const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Return', returnSchema);
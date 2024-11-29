const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  order: {
    type: Object,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Dispatch', dispatchSchema);
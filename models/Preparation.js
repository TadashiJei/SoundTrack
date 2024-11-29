const mongoose = require('mongoose');

const preparationSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true
  },
  status: {
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

module.exports = mongoose.model('Preparation', preparationSchema);
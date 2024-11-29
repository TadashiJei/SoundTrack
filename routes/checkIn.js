const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');

// Get all check-ins
router.get('/', async (req, res) => {
  try {
    const checkIns = await CheckIn.find();
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one check-in
router.get('/:id', getCheckIn, (req, res) => {
  res.json(res.checkIn);
});

// Create one check-in
router.post('/', async (req, res) => {
  const checkIn = new CheckIn({
    items: req.body.items,
    condition: req.body.condition,
    location: req.body.location
  });

  try {
    const newCheckIn = await checkIn.save();
    res.status(201).json(newCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one check-in
router.patch('/:id', getCheckIn, async (req, res) => {
  if (req.body.items != null) {
    res.checkIn.items = req.body.items;
  }
  if (req.body.condition != null) {
    res.checkIn.condition = req.body.condition;
  }
  if (req.body.location != null) {
    res.checkIn.location = req.body.location;
  }

  try {
    const updatedCheckIn = await res.checkIn.save();
    res.json(updatedCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one check-in
router.delete('/:id', getCheckIn, async (req, res) => {
  try {
    await CheckIn.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Check-In' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCheckIn(req, res, next) {
  let checkIn;
  try {
    checkIn = await CheckIn.findById(req.params.id);
    if (checkIn == null) {
      return res.status(404).json({ message: 'Cannot find Check-In' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.checkIn = checkIn;
  next();
}

module.exports = router;
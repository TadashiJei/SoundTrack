const express = require('express');
const router = express.Router();
const RFIDReader = require('../models/RFIDReader');

// Get all RFID readers
router.get('/', async (req, res) => {
  try {
    const readers = await RFIDReader.find();
    res.json(readers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one RFID reader
router.get('/:id', getRFIDReader, (req, res) => {
  res.json(res.rfidReader);
})

// Create one RFID reader 
router.post('/', async (req, res) => {
  const rfidReader = new RFIDReader({
    name: req.body.name,
    location: req.body.location,
    status: req.body.status
  });

  try {
    const newRFIDReader = await rfidReader.save();
    res.status(201).json(newRFIDReader);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one RFID reader
router.patch('/:id', getRFIDReader, async (req, res) => {
  if (req.body.name != null) {
    res.rfidReader.name = req.body.name;
  }
  if (req.body.location != null) {
    res.rfidReader.location = req.body.location;
  }
  if (req.body.status != null) {
    res.rfidReader.status = req.body.status;
  }

  try {
    const updatedRFIDReader = await res.rfidReader.save();
    res.json(updatedRFIDReader);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one RFID reader
router.delete('/:id', getRFIDReader, async (req, res) => {
  try {
    await RFIDReader.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted RFID Reader' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRFIDReader(req, res, next) {
  let rfidReader;
  try {
    rfidReader = await RFIDReader.findById(req.params.id);
    if (rfidReader == null) {
      return res.status(404).json({ message: 'Cannot find RFID Reader' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.rfidReader = rfidReader;
  next();
}

module.exports = router;
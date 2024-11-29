const express = require('express');
const router = express.Router();
const Preparation = require('../models/Preparation');

// Get all preparations
router.get('/', async (req, res) => {
  try {
    const preparations = await Preparation.find();
    res.json(preparations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one preparation
router.get('/:id', getPreparation, (req, res) => {
  res.json(res.preparation);
});

// Create one preparation
router.post('/', async (req, res) => {
  const preparation = new Preparation({
    items: req.body.items,
    status: req.body.status,
    notes: req.body.notes
  });

  try {
    const newPreparation = await preparation.save();
    res.status(201).json(newPreparation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one preparation
router.patch('/:id', getPreparation, async (req, res) => {
  if (req.body.items != null) {
    res.preparation.items = req.body.items;
  }
  if (req.body.status != null) {
    res.preparation.status = req.body.status;
  }
  if (req.body.notes != null) {
    res.preparation.notes = req.body.notes;
  }

  try {
    const updatedPreparation = await res.preparation.save();
    res.json(updatedPreparation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one preparation
router.delete('/:id', getPreparation, async (req, res) => {
  try {
    await Preparation.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Preparation' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPreparation(req, res, next) {
  let preparation;
  try {
    preparation = await Preparation.findById(req.params.id);
    if (preparation == null) {
      return res.status(404).json({ message: 'Cannot find Preparation' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.preparation = preparation;
  next();
}

module.exports = router;
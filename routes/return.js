const express = require('express');
const router = express.Router();
const Return = require('../models/Return');

// Get all returns
router.get('/', async (req, res) => {
  try {
    const returns = await Return.find();
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one return
router.get('/:id', getReturn, (req, res) => {
  res.json(res.return);
});

// Create one return
router.post('/', async (req, res) => {
  const returnItem = new Return({
    items: req.body.items,
    condition: req.body.condition,
    notes: req.body.notes
  });

  try {
    const newReturn = await returnItem.save();
    res.status(201).json(newReturn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one return
router.patch('/:id', getReturn, async (req, res) => {
  if (req.body.items != null) {
    res.return.items = req.body.items;
  }
  if (req.body.condition != null) {
    res.return.condition = req.body.condition;
  }
  if (req.body.notes != null) {
    res.return.notes = req.body.notes;
  }

  try {
    const updatedReturn = await res.return.save();
    res.json(updatedReturn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one return
router.delete('/:id', getReturn, async (req, res) => {
  try {
    await Return.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Return' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getReturn(req, res, next) {
  let returnItem;
  try {
    returnItem = await Return.findById(req.params.id);
    if (returnItem == null) {
      return res.status(404).json({ message: 'Cannot find Return' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.return = returnItem;
  next();
}

module.exports = router;
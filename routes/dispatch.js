const express = require('express');
const router = express.Router();
const Dispatch = require('../models/Dispatch');

// Get all dispatches
router.get('/', async (req, res) => {
  try {
    const dispatches = await Dispatch.find();
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one dispatch
router.get('/:id', getDispatch, (req, res) => {
  res.json(res.dispatch);
});

// Create one dispatch
router.post('/', async (req, res) => {
  const dispatch = new Dispatch({
    order: req.body.order,
    items: req.body.items,
    status: req.body.status
  });

  try {
    const newDispatch = await dispatch.save();
    res.status(201).json(newDispatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one dispatch
router.patch('/:id', getDispatch, async (req, res) => {
  if (req.body.order != null) {
    res.dispatch.order = req.body.order;
  }
  if (req.body.items != null) {
    res.dispatch.items = req.body.items;
  }
  if (req.body.status != null) {
    res.dispatch.status = req.body.status;
  }

  try {
    const updatedDispatch = await res.dispatch.save();
    res.json(updatedDispatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one dispatch
router.delete('/:id', getDispatch, async (req, res) => {
  try {
    await Dispatch.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Dispatch' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDispatch(req, res, next) {
  let dispatch;
  try {
    dispatch = await Dispatch.findById(req.params.id);
    if (dispatch == null) {
      return res.status(404).json({ message: 'Cannot find Dispatch' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.dispatch = dispatch;
  next();
}

module.exports = router;
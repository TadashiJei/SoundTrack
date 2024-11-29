const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one setting
router.get('/:id', getSetting, (req, res) => {
  res.json(res.setting);
});

// Create one setting
router.post('/', async (req, res) => {
  const setting = new Settings({
    ftpConfig: req.body.ftpConfig,
    serverSettings: req.body.serverSettings,
    credentials: req.body.credentials
  });

  try {
    const newSetting = await setting.save();
    res.status(201).json(newSetting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one setting
router.patch('/:id', getSetting, async (req, res) => {
  if (req.body.ftpConfig != null) {
    res.setting.ftpConfig = req.body.ftpConfig;
  }
  if (req.body.serverSettings != null) {
    res.setting.serverSettings = req.body.serverSettings;
  }
  if (req.body.credentials != null) {
    res.setting.credentials = req.body.credentials;
  }

  try {
    const updatedSetting = await res.setting.save();
    res.json(updatedSetting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one setting
router.delete('/:id', getSetting, async (req, res) => {
  try {
    await Settings.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Setting' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSetting(req, res, next) {
  let setting;
  try {
    setting = await Settings.findById(req.params.id);
    if (setting == null) {
      return res.status(404).json({ message: 'Cannot find Setting' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.setting = setting;
  next();
}

module.exports = router;
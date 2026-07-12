const express = require('express');
const router = express.Router();
const StateDistrict = require('../models/StateDistrict');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/state-districts
 * @desc    Get all state districts
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const list = await StateDistrict.find().sort({ state: 1, district: 1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching state districts:', error);
    res.status(500).json({ error: 'Server error fetching state districts' });
  }
});

/**
 * @route   POST /api/state-districts
 * @desc    Add a new state district
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, authorize(['admin']), async (req, res) => {
  const { state, district } = req.body;

  if (!state || !district) {
    return res.status(400).json({ error: 'State and district are required' });
  }

  try {
    const newStateDistrict = new StateDistrict({ state, district });
    await newStateDistrict.save();
    res.status(201).json(newStateDistrict);
  } catch (error) {
    console.error('Error adding state district:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This state and district mapping already exists' });
    }
    res.status(500).json({ error: 'Server error adding state district' });
  }
});

module.exports = router;

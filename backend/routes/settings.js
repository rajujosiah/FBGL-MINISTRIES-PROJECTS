const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/settings
 * @desc    Get site settings
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = new SiteSettings({
        show_all_projects_on_home: false,
        banner_title: 'FIRST BORN GOSPEL LIFE MINISTRIES',
        banner_subtitle: 'Transforming Lives through Social, Economic & Educational Empowerment in Christ'
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server error fetching site settings' });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update site settings
 * @access  Private (Admin only)
 */
router.put('/', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const { show_all_projects_on_home, banner_title, banner_subtitle, banner_image } = req.body;

    if (show_all_projects_on_home !== undefined) {
      settings.show_all_projects_on_home = show_all_projects_on_home;
    }
    if (banner_title !== undefined) {
      settings.banner_title = banner_title;
    }
    if (banner_subtitle !== undefined) {
      settings.banner_subtitle = banner_subtitle;
    }
    if (banner_image !== undefined) {
      settings.banner_image = banner_image;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error updating site settings' });
  }
});

module.exports = router;

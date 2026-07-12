const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  show_all_projects_on_home: {
    type: Boolean,
    default: false
  },
  banner_title: {
    type: String,
    trim: true
  },
  banner_subtitle: {
    type: String,
    trim: true
  },
  banner_image: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

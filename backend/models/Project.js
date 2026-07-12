const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['social', 'economy', 'education'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  location: {
    type: String,
    trim: true
  },
  area_of_operation: {
    type: String,
    trim: true
  },
  target_beneficiaries: {
    type: String,
    trim: true
  },
  project_manager_id: {
    type: String,
    ref: 'Profile',
    default: null
  },
  social_worker_id: {
    type: String,
    ref: 'Profile',
    default: null
  },
  images: {
    type: [String],
    default: []
  },
  show_on_home: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  _id: {
    type: String, // String type for legacy Firebase UIDs and new UUIDs
    required: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required unless they are board members (who don't log in)
      return this.role !== 'board_member';
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true
  },
  username: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'board_member', 'area_manager', 'project_manager', 'social_worker'],
    required: true
  },
  position: {
    type: String, // Required for board members
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  profile_picture: {
    type: String // Cloudflare URL or Base64 fallback
  },
  id_no: {
    type: String, // Unique identifier e.g., FBGL AP EG A01
    trim: true,
    sparse: true,
    unique: true
  },
  area_manager_id: {
    type: String, // References Profile._id (role: area_manager)
    ref: 'Profile',
    default: null
  },
  project_manager_id: {
    type: String, // References Profile._id (role: project_manager)
    ref: 'Profile',
    default: null
  },
  state: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  aadhaar_no: {
    type: String,
    trim: true
  },
  state_code: {
    type: String,
    default: 'KA'
  },
  district_code: {
    type: String,
    default: 'BLR'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Add Database Indexes for fast querying
profileSchema.index({ role: 1 });
profileSchema.index({ area_manager_id: 1 });
profileSchema.index({ project_manager_id: 1 });
profileSchema.index({ id_no: 1 });

module.exports = mongoose.model('Profile', profileSchema);


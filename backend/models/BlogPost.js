const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author_id: {
    type: String,
    ref: 'Profile',
    required: true
  },
  author_name: {
    type: String,
    required: true,
    trim: true
  },
  published: {
    type: Boolean,
    default: true
  },
  cover_image: {
    type: String // Cloudflare URL
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Add Database Indexes for fast querying
blogPostSchema.index({ published: 1, created_at: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);


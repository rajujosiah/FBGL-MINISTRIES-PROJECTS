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

module.exports = mongoose.model('BlogPost', blogPostSchema);

const express = require('express');
const router = express.Router();
const multer = require('multer');
const BlogPost = require('../models/BlogPost');
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadImage } = require('../services/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

/**
 * @route   GET /api/blog
 * @desc    Get all blog posts
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ created_at: -1 })
      .populate('author_id', 'name role');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Server error fetching blog posts' });
  }
});

/**
 * @route   GET /api/blog/:id
 * @desc    Get a single blog post
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author_id', 'name role');
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Server error fetching blog post' });
  }
});

/**
 * @route   POST /api/blog
 * @desc    Create a blog post
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, authorize(['admin']), upload.single('cover_image'), async (req, res) => {
  const { title, content, published } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    let coverImageUrl = '';
    if (req.file) {
      coverImageUrl = await uploadImage(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    const newPost = new BlogPost({
      title,
      content,
      published: published !== undefined ? published === 'true' : true,
      author_id: req.user._id,
      author_name: req.user.name,
      cover_image: coverImageUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: error.message || 'Server error creating blog post' });
  }
});

/**
 * @route   PUT /api/blog/:id
 * @desc    Update a blog post
 * @access  Private (Admin only)
 */
router.put('/:id', verifyToken, authorize(['admin']), upload.single('cover_image'), async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    let post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (req.file) {
      updates.cover_image = await uploadImage(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    if (updates.published !== undefined) {
      updates.published = updates.published === 'true';
    }

    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'created_at' && key !== 'updated_at') {
        post[key] = updates[key];
      }
    });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: error.message || 'Server error updating blog post' });
  }
});

/**
 * @route   DELETE /api/blog/:id
 * @desc    Delete a blog post
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Server error deleting blog post' });
  }
});

module.exports = router;

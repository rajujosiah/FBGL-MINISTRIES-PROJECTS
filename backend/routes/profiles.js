const express = require('express');
const router = express.Router();

const multer = require('multer');
const Profile = require('../models/Profile');
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadImage } = require('../services/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/profiles
 * @desc    Get all profiles with optional filters (role, manager associations)
 * @access  Public (for team listing)
 */
router.get('/', async (req, res) => {
  const { role, areaManagerId, projectManagerId } = req.query;
  const filter = {};

  if (role) {
    filter.role = role;
  }
  if (areaManagerId) {
    filter.area_manager_id = areaManagerId;
  }
  if (projectManagerId) {
    filter.project_manager_id = projectManagerId;
  }

  try {
    const profiles = await Profile.find(filter)
      .sort({ id_no: 1, name: 1 })
      .populate('area_manager_id', 'name id_no')
      .populate('project_manager_id', 'name id_no')
      .lean();

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Server error fetching profiles' });
  }
});

/**
 * @route   GET /api/profiles/:id
 * @desc    Get a single profile by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    let profile = null;
    
    // Check if ID matches common MongoDB format or string IDs
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/) || req.params.id.includes('_')) {
      try {
        profile = await Profile.findById(req.params.id)
          .populate('area_manager_id', 'name id_no')
          .populate('project_manager_id', 'name id_no')
          .lean();
      } catch (_) {}
    }

    // Fallback: search by id_no (case-insensitive)
    if (!profile) {
      const searchId = req.params.id.trim();
      profile = await Profile.findOne({ 
        id_no: { $regex: new RegExp('^' + searchId.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } 
      })
      .populate('area_manager_id', 'name id_no')
      .populate('project_manager_id', 'name id_no')
      .lean();
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {

    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

/**
 * @route   PUT /api/profiles/:id
 * @desc    Update a profile (User update self or admin/manager update subordinate)
 * @access  Private
 */
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    let profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Authorization checks:
    // 1. Admin can update anyone
    // 2. User can update their own profile
    // 3. Area Manager can update Project Managers reporting to them
    // 4. Project Manager can update Social Workers reporting to them
    const creator = req.user;
    let isAuthorized = false;

    if (creator.role === 'admin' || creator._id.toString() === id.toString()) {
      isAuthorized = true;
    } else if (creator.role === 'area_manager' && profile.role === 'project_manager' && profile.area_manager_id?.toString() === creator._id.toString()) {
      isAuthorized = true;
    } else if (creator.role === 'project_manager' && profile.role === 'social_worker' && profile.project_manager_id?.toString() === creator._id.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this profile.' });
    }

    // Handle password update if passed in request body
    if (updates.password) {
      if (profile.role !== 'board_member') {
        await admin.auth().updateUser(id, {
          password: updates.password
        });
      }
      delete updates.password; // Do not save plain text password in MongoDB
    }

    // Restrict role modification
    if (updates.role && updates.role !== profile.role && creator.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only administrators can modify user roles.' });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      // Prevent overwriting _id or timestamps
      if (key !== '_id' && key !== 'created_at' && key !== 'updated_at') {
        profile[key] = updates[key];
      }
    });

    await profile.save();
    
    // Fetch updated profile with populated fields
    const updatedProfile = await Profile.findById(id)
      .populate('area_manager_id', 'name id_no')
      .populate('project_manager_id', 'name id_no');

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message || 'Server error updating profile' });
  }
});

/**
 * @route   DELETE /api/profiles/:id
 * @desc    Delete a profile
 * @access  Private (Admin or hierarchical manager)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Authorization checks:
    const creator = req.user;
    let isAuthorized = false;

    if (creator.role === 'admin') {
      isAuthorized = true;
    } else if (creator.role === 'area_manager' && profile.role === 'project_manager' && profile.area_manager_id === creator._id) {
      isAuthorized = true;
    } else if (creator.role === 'project_manager' && profile.role === 'social_worker' && profile.project_manager_id === creator._id) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this profile.' });
    }

    // 2. Delete MongoDB Profile
    await Profile.findByIdAndDelete(id);

    // 3. Clear associations for children (e.g. if Area Manager is deleted, set area_manager_id to null for PMs)
    if (profile.role === 'area_manager') {
      await Profile.updateMany({ area_manager_id: id }, { area_manager_id: null });
    } else if (profile.role === 'project_manager') {
      await Profile.updateMany({ project_manager_id: id }, { project_manager_id: null });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Server error deleting profile' });
  }
});

module.exports = router;

/**
 * @route   POST /api/profiles/:id/image
 * @desc    Upload a profile picture for a profile
 * @access  Private
 */
router.post('/:id/image', verifyToken, upload.single('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const creator = req.user;
    let isAuthorized = false;

    if (creator.role === 'admin' || creator._id === id) {
      isAuthorized = true;
    } else if (creator.role === 'area_manager' && profile.role === 'project_manager' && profile.area_manager_id === creator._id) {
      isAuthorized = true;
    } else if (creator.role === 'project_manager' && profile.role === 'social_worker' && profile.project_manager_id === creator._id) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this profile.' });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImage(req.file.buffer, req.file.mimetype, req.file.originalname);
    
    // Save URL to profile
    profile.profile_picture = imageUrl;
    await profile.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profile_picture: imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: error.message || 'Server error uploading image' });
  }
});

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadImage } = require('../services/cloudinary');

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filters (socialWorkerId, projectManagerId, areaManagerId, category, status, showOnHome)
 * @access  Public
 */
router.get('/', async (req, res) => {
  const { socialWorkerId, projectManagerId, areaManagerId, category, status, showOnHome } = req.query;
  const filter = {};

  if (socialWorkerId) {
    filter.social_worker_id = socialWorkerId;
  }
  if (projectManagerId) {
    filter.project_manager_id = projectManagerId;
  }
  if (category) {
    filter.category = category;
  }
  if (status) {
    filter.status = status;
  }
  if (showOnHome) {
    filter.show_on_home = showOnHome === 'true';
  }

  try {
    // If areaManagerId is provided, resolve PMs under them first
    if (areaManagerId) {
      const projectManagers = await Profile.find({ role: 'project_manager', area_manager_id: areaManagerId });
      const pmIds = projectManagers.map(pm => pm._id);
      if (pmIds.length > 0) {
        filter.project_manager_id = { $in: pmIds };
      } else {
        return res.json([]); // No PMs, so no projects
      }
    }

    const projects = await Project.find(filter)
      .sort({ created_at: -1 })
      .populate('project_manager_id', 'name id_no')
      .populate('social_worker_id', 'name id_no');

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'project_manager_id',
        select: 'name id_no',
        populate: { path: 'area_manager_id', select: 'name id_no' }
      })
      .populate('social_worker_id', 'name id_no');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, authorize(['admin']), async (req, res) => {
  const { title, description, category, status, location, area_of_operation, target_beneficiaries, project_manager_id, social_worker_id, images } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  try {
    const newProject = new Project({
      title,
      description,
      category,
      status: status || 'upcoming',
      location,
      area_of_operation,
      target_beneficiaries,
      project_manager_id: project_manager_id || null,
      social_worker_id: social_worker_id || null,
      images: images || []
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private (Admin/Project Manager/Social Worker)
 */
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Authorization: Admin can update any project. 
    // Assigned PM or SW can update the project details/status/images.
    const user = req.user;
    let isAuthorized = false;

    if (user.role === 'admin') {
      isAuthorized = true;
    } else if (user.role === 'area_manager') {
      isAuthorized = true; // Temporary: AMs can edit projects in their UI
    } else if (user.role === 'project_manager' && project.project_manager_id?.toString() === user._id.toString()) {
      isAuthorized = true;
    } else if (user.role === 'social_worker' && project.social_worker_id?.toString() === user._id.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to edit this project' });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'created_at' && key !== 'updated_at') {
        project[key] = updates[key];
      }
    });

    await project.save();

    const updatedProject = await Project.findById(id)
      .populate('project_manager_id', 'name id_no')
      .populate('social_worker_id', 'name id_no');

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error updating project' });
  }
});

/**
 * @route   PUT /api/projects/:id/toggle-home
 * @desc    Toggle show_on_home status
 * @access  Private (Admin only)
 */
router.put('/:id/toggle-home', verifyToken, authorize(['admin']), async (req, res) => {
  const { show_on_home } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { show_on_home: !!show_on_home },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error toggling home status:', error);
    res.status(500).json({ error: 'Server error updating project' });
  }
});

/**
 * @route   POST /api/projects/:id/images
 * @desc    Upload progress photos to a project
 * @access  Private (Admin/Project Manager/Social Worker)
 */
router.post('/:id/images', verifyToken, upload.array('images', 5), async (req, res) => {
  const { id } = req.params;

  try {
    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const user = req.user;
    let isAuthorized = false;

    if (user.role === 'admin') {
      isAuthorized = true;
    } else if (user.role === 'area_manager') {
      isAuthorized = true; 
    } else if (user.role === 'project_manager' && project.project_manager_id?.toString() === user._id.toString()) {
      isAuthorized = true;
    } else if (user.role === 'social_worker' && project.social_worker_id?.toString() === user._id.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to upload images for this project' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const uploadPromises = req.files.map(file =>
      uploadImage(file.buffer, file.mimetype, file.originalname)
    );

    const imageUrls = await Promise.all(uploadPromises);

    project.images = [...(project.images || []), ...imageUrls];
    await project.save();

    res.json({ message: 'Images uploaded successfully', images: project.images });
  } catch (error) {
    console.error('Error uploading project images:', error);
    res.status(500).json({ error: error.message || 'Server error uploading images' });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, authorize(['admin']), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
});

module.exports = router;

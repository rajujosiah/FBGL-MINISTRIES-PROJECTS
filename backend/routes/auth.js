const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { verifyToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'fbgl-super-secret-key-fallback';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user in MongoDB (Admin/Manager only)
 * @access  Private (Hierarchical restriction)
 */
router.post('/register', verifyToken, async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    id_no,
    position, // for board_members
    state,
    district,
    address,
    phone,
    aadhaar_no,
    area_manager_id,
    project_manager_id
  } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  // Enforce roles hierarchy
  const creatorRole = req.user.role;
  let isAuthorized = false;

  if (creatorRole === 'admin') {
    isAuthorized = true;
  } else if (creatorRole === 'area_manager' && role === 'project_manager') {
    isAuthorized = true;
  } else if (creatorRole === 'project_manager' && role === 'social_worker') {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return res.status(403).json({
      error: `Forbidden: As a ${creatorRole}, you cannot create a ${role}.`
    });
  }

  // Board members do not require accounts if they do not log in.
  const requiresAuthAccount = role !== 'board_member';

  if (requiresAuthAccount && (!email || !password)) {
    return res.status(400).json({ error: 'Email and password are required for this role' });
  }

  try {
    let generatedIdNo = id_no;
    if (role !== 'admin') {
      const s = state || 'HQ';
      const d = district || 'HQ';
      let roleCode = 'M';
      if (role === 'area_manager') roleCode = 'A';
      else if (role === 'project_manager') roleCode = 'P';
      else if (role === 'social_worker') roleCode = 'S';
      else if (role === 'board_member') roleCode = 'B';
      
      const count = await Profile.countDocuments({ role }) + 1;
      const countStr = count.toString().padStart(2, '0');
      generatedIdNo = `FBGL ${s} ${d} ${roleCode}${countStr}`;
    } else if (role === 'admin' && (!generatedIdNo || generatedIdNo.trim() === '')) {
      const count = await Profile.countDocuments({ role: 'admin' }) + 1;
      const countStr = count.toString().padStart(2, '0');
      generatedIdNo = `FBGL ADMIN ${countStr}`;
    }

    let hashedPassword;
    if (requiresAuthAccount) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const uid = crypto.randomUUID();

    // Create profile in MongoDB
    const newProfile = new Profile({
      _id: uid,
      name,
      email: requiresAuthAccount ? email : undefined,
      password: hashedPassword,
      role,
      id_no: generatedIdNo,
      position: role === 'board_member' ? position : undefined,
      state,
      district,
      address,
      phone,
      aadhaar_no,
      area_manager_id: role === 'project_manager' ? (area_manager_id || (req.user.role === 'area_manager' ? req.user._id : undefined)) : undefined,
      project_manager_id: role === 'social_worker' ? (project_manager_id || (req.user.role === 'project_manager' ? req.user._id : undefined)) : undefined
    });

    await newProfile.save();

    // Strip password from response
    const profileResponse = newProfile.toObject();
    delete profileResponse.password;

    res.status(201).json({
      message: `${role} registered successfully`,
      profile: profileResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email, username, or ID number already exists in database' });
    }
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login and get JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await Profile.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const payload = {
      uid: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * @route   POST /api/auth/login-verify
 * @desc    Verify JWT token and return user profile details
 * @access  Private (Any authenticated user)
 */
router.post('/login-verify', verifyToken, async (req, res) => {
  // verifyToken middleware already loads user into req.user
  const userResponse = req.user.toObject ? req.user.toObject() : req.user;
  delete userResponse.password;

  res.json({
    message: 'Authentication successful',
    user: userResponse
  });
});

module.exports = router;

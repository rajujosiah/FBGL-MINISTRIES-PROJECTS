const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fbgl-super-secret-key-fallback';

/**
 * Middleware to verify Custom JWT token and fetch user profile from MongoDB
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Handle development mock tokens directly (backward compatibility for testing)
  if (token.startsWith('mock-')) {
    console.log('⚡ Handling Mock Token Verification in Middleware:', token);
    let decodedToken;
    if (token === 'mock-admin-token') {
      decodedToken = { uid: 'mock_admin_uid', email: 'admin@fbgl.org', email_verified: true };
    } else {
      const parts = token.split('-');
      const role = parts[1] || 'social_worker';
      const uid = `${role}_uid`; // e.g. area_manager_uid
      decodedToken = { uid, email: `${role}@fbgl.org`, email_verified: true, role };
    }

    req.jwtUser = decodedToken;

    // Fetch user profile from MongoDB
    const profile = await Profile.findById(decodedToken.uid);
    if (!profile) {
      if (decodedToken.email === 'admin@fbgl.org' || decodedToken.email === 'admin') {
        req.user = {
          _id: decodedToken.uid,
          name: 'Super Admin',
          email: decodedToken.email,
          role: 'admin',
          toObject: function() { return this; }
        };
        return next();
      }
      return res.status(403).json({ error: 'Forbidden: Mock profile not found in database' });
    }

    req.user = profile;
    return next();
  }

  // 2. Real JWT token verification
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.jwtPayload = decodedToken;

    // Fetch user profile from MongoDB
    const profile = await Profile.findById(decodedToken.uid);
    if (!profile) {
      return res.status(403).json({ error: 'Forbidden: Profile not found in database' });
    }

    req.user = profile;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<string>} roles Allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorize
};

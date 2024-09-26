// src/middlewares/authMiddleware.js

const admin = require('../services/firebaseService');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach decoded token to request

    // Fetch user from the database
    const user = await User.findOne({ auth_id: decodedToken.uid });
    if (user) {
      req.user.role = user.role;
      req.user._id = user._id;
    } else {
      req.user.role = 'student'; // Default role if user not found
    }

    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

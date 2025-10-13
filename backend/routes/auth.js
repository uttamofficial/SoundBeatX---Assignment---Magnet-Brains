const express = require('express');
const router = express.Router();

// Note: User authentication routes are currently disabled
// Admin authentication is handled in /api/admin/auth routes

// User signup - Currently disabled
router.post('/signup', async (req, res) => {
  res.status(501).json({ 
    error: 'User signup is currently disabled. Please use admin authentication for testing.' 
  });
});

// User login - Currently disabled
router.post('/login', async (req, res) => {
  res.status(501).json({ 
    error: 'User login is currently disabled. Please use admin authentication for testing.' 
  });
});

// User logout - Currently disabled
router.post('/logout', async (req, res) => {
  res.status(501).json({ 
    error: 'User logout is currently disabled. Please use admin authentication for testing.' 
  });
});

// Get user profile - Currently disabled
router.get('/profile', async (req, res) => {
  res.status(501).json({ 
    error: 'User profile is currently disabled. Please use admin authentication for testing.' 
  });
});

module.exports = router;
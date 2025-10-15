const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== Admin Login Attempt ===');
    console.log('Email:', email);

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log('❌ Admin not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Admin found:', admin.email);

    // Check if admin is active
    if (!admin.is_active) {
      console.log('❌ Admin account is deactivated');
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.last_login = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'admin_secret_key',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful for:', admin.email);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Admin register (only for development/testing)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with this email or username' });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email: email.toLowerCase(),
      password,
      role: role || 'admin'
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newAdmin._id, 
        email: newAdmin.email, 
        role: newAdmin.role 
      },
      process.env.JWT_SECRET || 'admin_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin_secret_key');
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Get admin profile
router.get('/profile', verifyAdminToken, (req, res) => {
  const admin = admins.find(a => a.id === req.admin.id);
  if (!admin) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  res.json({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role
  });
});

module.exports = { router, verifyAdminToken };
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://uttamofficial005_db_user:wx51KtgiW0q5CxuU@cluster0.kqq3laf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@soundbeatx.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      console.log('   Use these credentials to login');
    } else {
      // Create default admin
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@soundbeatx.com',
        password: 'admin123', // This will be hashed by the pre-save hook
        role: 'super_admin',
        is_active: true
      });

      await defaultAdmin.save();
      console.log('✅ Default admin created successfully!');
      console.log('   Email: admin@soundbeatx.com');
      console.log('   Password: admin123');
      console.log('   Username: admin');
    }

    await mongoose.disconnect();
    console.log('✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

createDefaultAdmin();
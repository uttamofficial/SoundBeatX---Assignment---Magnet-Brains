const mongoose = require('mongoose');

// MongoDB Atlas connection string
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://uttamofficial005_db_user:wx51KtgiW0q5CxuU@cluster0.kqq3laf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Database name
const dbName = process.env.DB_NAME || 'soundbeatx';

// Connection options
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📍 Database:', conn.connection.name);
    console.log('📍 Host:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = { connectDB, mongoose };

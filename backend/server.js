const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const { connectDB } = require('./config/mongodb');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5010;

// Configure CORS with specific origins
const corsOptions = {
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase payload limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/orders');
const cloudinaryRoutes = require('./routes/cloudinary');
const { router: adminAuthRoutes } = require('./routes/adminAuth');
const adminProductRoutes = require('./routes/adminProducts');
const adminOrderRoutes = require('./routes/adminOrders');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PrintNSupply Backend API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend test successful!',
    endpoints: [
      '/api/products',
      '/api/auth', 
      '/api/orders',
      '/stationery',
      '/api/stationery'
    ]
  });
});

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// Add gadgets endpoints
app.get('/gadgets', async (req, res) => {
  try {
    const mockProducts = require('./data/products');
    res.json(mockProducts);
  } catch (error) {
    console.error('Error fetching gadgets:', error);
    res.status(500).json({ error: 'Failed to fetch gadgets' });
  }
});

// Add API gadgets endpoint as well
app.get('/api/gadgets', async (req, res) => {
  try {
    const mockProducts = require('./data/products');
    res.json(mockProducts);
  } catch (error) {
    console.error('Error fetching gadgets:', error);
    res.status(500).json({ error: 'Failed to fetch gadgets' });
  }
});

// API routes that don't exist
app.get('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found', 
    path: req.path,
    message: 'Please check the API documentation for available endpoints'
  });
});

// For production, serve the React app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
      console.log(`🔧 Backend URL: ${process.env.BACKEND_URL || 'local'}`);
      console.log(`📡 CORS enabled for frontend communication`);
      console.log(`🔗 CORS Origins:`, corsOptions.origin);
      console.log(`📍 Environment FRONTEND_URL:`, process.env.FRONTEND_URL || 'Not set');
      console.log(`🗄️ Database: MongoDB Atlas connected`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
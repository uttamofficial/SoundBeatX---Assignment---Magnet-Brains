const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcwzukqqw',
  api_key: process.env.CLOUDINARY_API_KEY || '186845815876347',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'E4sZOwi0lAOtfJ6pukPm3ThIsHA'
});

module.exports = cloudinary;
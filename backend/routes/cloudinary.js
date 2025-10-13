const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Proxy endpoint to stream PDF files from Cloudinary
// This bypasses 401 errors by fetching with authenticated backend
router.get('/view/:publicId(*)', async (req, res) => {
  try {
    let publicId = req.params.publicId;
    publicId = decodeURIComponent(publicId);
    
    console.log('📥 Proxying PDF request for:', publicId);
    
    // Build authenticated URL using Cloudinary's utility functions
    // This generates a properly signed URL that Cloudinary will accept
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      type: 'upload',
    });
    
    console.log('� Fetching from signed URL');
    
    // Fetch the file from Cloudinary
    const response = await axios({
      method: 'get',
      url: signedUrl,
      responseType: 'stream',
      timeout: 30000, // 30 second timeout
    });
    
    // Set appropriate headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + publicId.split('/').pop() + '"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Pipe the file stream to the response
    response.data.pipe(res);
    
    console.log('✅ Successfully streaming PDF');
    
  } catch (error) {
    console.error('❌ Error proxying PDF:', error.message);
    
    // Log more details for debugging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to load PDF',
      details: error.message
    });
  }
});

// Download endpoint - same as view but with attachment header
router.get('/download/:publicId(*)', async (req, res) => {
  try {
    let publicId = req.params.publicId;
    publicId = decodeURIComponent(publicId);
    
    console.log('📥 Download request for:', publicId);
    
    // Build authenticated URL using Cloudinary's utility functions
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      type: 'upload',
    });
    
    console.log('🔗 Fetching from signed URL for download');
    
    // Fetch the file from Cloudinary
    const response = await axios({
      method: 'get',
      url: signedUrl,
      responseType: 'stream',
      timeout: 30000,
    });
    
    // Set appropriate headers for PDF downloading (attachment instead of inline)
    const filename = publicId.split('/').pop();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Pipe the file stream to the response
    response.data.pipe(res);
    
    console.log('✅ Successfully streaming PDF for download');
    
  } catch (error) {
    console.error('❌ Error downloading PDF:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to download PDF',
      details: error.message
    });
  }
});

// Generate signed URL for viewing a file
router.get('/signed-url/:publicId(*)', (req, res) => {
  try {
    let publicId = req.params.publicId;
    
    // Decode the public ID
    publicId = decodeURIComponent(publicId);
    
    console.log('📥 Received public ID:', publicId);
    
    // Generate authentication token for the URL
    const crypto = require('crypto');
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Build the string to sign
    const stringToSign = `timestamp=${timestamp}&${process.env.CLOUDINARY_API_SECRET}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');
    
    // Build authenticated URL with token
    const authenticatedUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}?timestamp=${timestamp}&signature=${signature}&api_key=${process.env.CLOUDINARY_API_KEY}`;
    
    console.log('✅ Generated authenticated URL with signature');
    
    res.json({
      success: true,
      url: authenticatedUrl,
      publicId: publicId
    });
    
  } catch (error) {
    console.error('❌ Error generating signed URL:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get file details
router.get('/file-details/:publicId(*)', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Get resource details from Cloudinary
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'raw'
    });

    console.log('File details:', result);
    
    res.json({
      success: true,
      details: result
    });
  } catch (error) {
    console.error('Error getting file details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

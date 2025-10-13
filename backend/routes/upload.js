const express = require('express');
const router = express.Router();
const CloudinaryService = require('../services/cloudinaryService');

// Middleware for handling file uploads
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload a single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get folder from request or use default
    const folder = req.body.folder || 'uploads';

    // Upload to Cloudinary
    const result = await CloudinaryService.uploadFile(req.file, folder);

    res.status(200).json({
      message: 'File uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get folder from request or use default
    const folder = req.body.folder || 'uploads';

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => CloudinaryService.uploadFile(file, folder));
    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      message: `${req.files.length} files uploaded successfully`,
      data: results
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Upload base64 file
router.post('/base64', async (req, res) => {
  try {
    const { base64, folder } = req.body;

    if (!base64) {
      return res.status(400).json({ error: 'No base64 data provided' });
    }

    // Upload to Cloudinary
    const result = await CloudinaryService.uploadBase64(base64, folder || 'uploads');

    res.status(200).json({
      message: 'File uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading base64 file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete a file
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ error: 'No public ID provided' });
    }

    // Delete from Cloudinary
    const result = await CloudinaryService.deleteFile(publicId);

    res.status(200).json({
      message: 'File deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
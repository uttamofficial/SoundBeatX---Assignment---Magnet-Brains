const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

class CloudinaryService {
  // Upload a file to Cloudinary
  static async uploadFile(file, folder = 'uploads') {
    try {
      // If file is a path, read it first
      let fileBuffer;
      if (typeof file === 'string') {
        // It's a file path
        fileBuffer = fs.readFileSync(file);
      } else if (file.buffer) {
        // It's a multer file object
        fileBuffer = file.buffer;
      } else {
        throw new Error('Invalid file format');
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileBuffer.toString('base64')}`, {
        folder: folder,
        use_filename: true,
        unique_filename: false
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  // Upload a file from base64 data
  static async uploadBase64(base64Data, folder = 'uploads') {
    try {
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: folder,
        use_filename: true,
        unique_filename: false
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Error uploading base64 to Cloudinary:', error);
      throw error;
    }
  }

  // Delete a file from Cloudinary
  static async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }

  // Get file info from Cloudinary
  static async getFileInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Error getting file info from Cloudinary:', error);
      throw error;
    }
  }
}

module.exports = CloudinaryService;
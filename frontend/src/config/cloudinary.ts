// Cloudinary configuration for frontend
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcwzukqqw',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'printnsupply'
};

export default cloudinaryConfig;
import cloudinaryConfig from '../config/cloudinary';

const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
const API_URL = runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010';

class CloudinaryService {
  // Upload a file directly to Cloudinary from the frontend
  static async uploadFile(
    file: File, 
    folder: string = 'uploads',
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", folder);
    
    // For PDFs, use 'image' resource type to get page count metadata
    // This allows Cloudinary to analyze the PDF and return page count
    formData.append("resource_type", "image");
    
    // Note: access_mode is NOT allowed with unsigned uploads
    // Access is controlled by the upload preset configuration in Cloudinary dashboard

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            
            // Debug logging
            console.log('🔍 Cloudinary Upload Response:', {
              secure_url: data.secure_url,
              resource_type: data.resource_type,
              format: data.format,
              public_id: data.public_id,
              pages: data.pages,
              access_mode: data.access_mode,
              type: data.type,
            });
            
            // IMPORTANT: Use Cloudinary's secure_url directly
            // This URL is always accessible and properly signed
            let viewUrl = data.secure_url;
            let downloadUrl = data.secure_url;
            
            // For PDFs, we'll request a signed URL from our backend
            // This ensures the URL will work regardless of Cloudinary settings
            if (data.format === 'pdf' && data.public_id) {
              // We'll use the backend to generate a signed URL
              // For now, use secure_url and we'll enhance it later
              viewUrl = data.secure_url;
              
              // For download, add fl_attachment flag via transformation
              // Insert transformation after /upload/
              downloadUrl = data.secure_url.replace('/upload/', '/upload/fl_attachment/');
              
              console.log('🔗 Generated URLs:', {
                original: data.secure_url,
                view: viewUrl,
                download: downloadUrl,
                publicId: data.public_id,
                pages: data.pages,
              });
            }
            
            resolve({
              url: data.secure_url, // Original URL - ALWAYS use this
              viewUrl: viewUrl, // URL for viewing in browser
              downloadUrl: downloadUrl, // URL for downloading
              public_id: data.public_id,
              format: data.format,
              resource_type: data.resource_type,
              bytes: data.bytes,
              pages: data.pages || 1, // PDF page count if available
            });
          } catch (error: any) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error?.message || `HTTP error! status: ${xhr.status}`));
          } catch {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      // Use 'image' endpoint for PDFs to get page count
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`);
      xhr.send(formData);
    });
  }

  // Upload base64 data to Cloudinary
  static async uploadBase64(base64Data: string, folder: string = 'uploads'): Promise<any> {
    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } catch (error) {
      console.error('Error uploading base64 to Cloudinary:', error);
      throw error;
    }
  }

  // Delete a file from Cloudinary (this still needs to go through our backend for security)
  static async deleteFile(publicId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/upload/${publicId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  // Get a proxied URL for viewing a file through our backend
  // This bypasses Cloudinary 401 errors by streaming through our server
  static getProxiedUrl(publicId: string): string {
    // For raw files (like PDFs), add .pdf extension if not present
    let fullPublicId = publicId;
    
    if (!fullPublicId.toLowerCase().endsWith('.pdf')) {
      fullPublicId = `${publicId}.pdf`;
    }
    
    // Return URL to our backend proxy endpoint
    const proxiedUrl = `${API_URL}/api/cloudinary/view/${encodeURIComponent(fullPublicId)}`;
    console.log('🔗 Generated proxied URL:', proxiedUrl);
    return proxiedUrl;
  }

  // Get a proxied download URL through our backend
  static getProxiedDownloadUrl(publicId: string): string {
    // For raw files (like PDFs), add .pdf extension if not present
    let fullPublicId = publicId;
    
    if (!fullPublicId.toLowerCase().endsWith('.pdf')) {
      fullPublicId = `${publicId}.pdf`;
    }
    
    // Return URL to our backend download endpoint
    const downloadUrl = `${API_URL}/api/cloudinary/download/${encodeURIComponent(fullPublicId)}`;
    console.log('📥 Generated download URL:', downloadUrl);
    return downloadUrl;
  }

  // Get a signed URL for viewing a file (bypasses 401 errors)
  static async getSignedUrl(publicId: string): Promise<string> {
    try {
      // For raw files (like PDFs), DO NOT remove the extension
      // Cloudinary needs the full public_id with extension for raw resources
      // Example: "student_prints/230.full_2017_i74uak" needs to become "student_prints/230.full_2017_i74uak.pdf"
      
      // But wait - the public_id from Cloudinary upload already includes the path but not extension
      // For raw files, we need to add .pdf extension
      let fullPublicId = publicId;
      
      // Add .pdf extension if not already present
      if (!fullPublicId.toLowerCase().endsWith('.pdf')) {
        fullPublicId = `${publicId}.pdf`;
      }
      
      console.log('🔍 Requesting signed URL for:', fullPublicId);
      
      const response = await fetch(`${API_URL}/api/cloudinary/signed-url/${encodeURIComponent(fullPublicId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Got signed URL from backend:', result.url);
      return result.url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      // Fallback to original URL if backend fails
      throw error;
    }
  }
}

export default CloudinaryService;
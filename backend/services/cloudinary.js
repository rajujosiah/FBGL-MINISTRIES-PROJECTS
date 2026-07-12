const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cloudinary Configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isCloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  isCloudinaryConfigured = true;
  console.log('☁️ Cloudinary Storage Service Initialized Successfully');
} else {
  console.log('📁 No Cloudinary credentials found. Falling back to local disk storage for uploads.');
}

/**
 * Upload an image file buffer to Cloudinary (or local disk fallback)
 * @param {Buffer} fileBuffer File content buffer
 * @param {string} mimeType File MIME type
 * @param {string} originalName Original filename
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadImage = async (fileBuffer, mimeType, originalName) => {
  const extension = path.extname(originalName) || '.jpg';
  const uniqueName = `${crypto.randomUUID()}${extension}`;

  // 1. Try Cloudinary Upload
  if (isCloudinaryConfigured) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'fbgl_ministries',
            resource_type: 'image',
            public_id: path.basename(uniqueName, extension),
            format: 'jpg'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload_stream error:', error);
              return reject(new Error('Cloudinary stream upload failed: ' + error.message));
            }
            resolve(result.secure_url);
          }
        );
        
        // Write buffer to upload stream
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Cloudinary upload failed: ' + error.message);
    }
  }

  // 2. Fallback to Local Disk Uploads
  try {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);

    // Express static hosting path
    const backendPort = process.env.PORT || 5000;
    const appUrl = process.env.APP_URL || `http://localhost:${backendPort}`;
    return `${appUrl}/uploads/${uniqueName}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Local upload failed: ' + error.message);
  }
};

module.exports = {
  uploadImage
};

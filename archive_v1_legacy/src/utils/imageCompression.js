/**
 * Compress and convert image to base64
 * @param {File} file - Image file to compress
 * @param {number} maxSizeKB - Maximum size in KB (default: 500)
 * @param {number} quality - Compression quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Base64 string
 */
export const compressImageToBase64 = (file, maxSizeKB = 500, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      let { width, height } = img;
      const maxDimension = 1200; // Max width or height

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels if file is too large
      const tryCompress = (currentQuality) => {
        const dataURL = canvas.toDataURL('image/jpeg', currentQuality);
        const sizeKB = (dataURL.length * 0.75) / 1024; // Approximate size in KB

        if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
          resolve(dataURL);
        } else {
          tryCompress(currentQuality - 0.1);
        }
      };

      tryCompress(quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compress multiple images to base64
 * @param {File[]} files - Array of image files
 * @param {number} maxSizeKB - Maximum size per image in KB
 * @returns {Promise<string[]>} Array of base64 strings
 */
export const compressMultipleImages = async (files, maxSizeKB = 500) => {
  const promises = files.map(file => compressImageToBase64(file, maxSizeKB));
  return Promise.all(promises);
};

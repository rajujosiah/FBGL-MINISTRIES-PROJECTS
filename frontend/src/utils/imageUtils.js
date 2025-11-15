// Convert image file to base64 string
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Optimize base64 image by compressing (simple size check)
export const optimizeBase64 = (base64String, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with quality
      const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(optimizedBase64);
    };
    img.onerror = () => resolve(base64String); // Fallback to original
    img.src = base64String;
  });
};

// Get base64 image size in KB
export const getBase64Size = (base64String) => {
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  const sizeInBytes = 4 * Math.ceil(base64Length / 3) * 0.5624896334383812;
  return (sizeInBytes / 1024).toFixed(2);
};



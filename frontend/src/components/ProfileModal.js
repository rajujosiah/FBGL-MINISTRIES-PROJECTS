import React, { useState, useEffect } from 'react';
import IDCard from './IDCard';
import { 
  updateAreaManager, 
  updateProjectManager, 
  updateSocialWorker 
} from '../utils/dataManager';
import { validateImageFile, compressImage } from '../utils/imageUtils';
import html2canvas from 'html2canvas';
import './ProfileModal.css';

const ProfileModal = ({ user, role, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('view'); // 'view', 'edit', 'idcard'
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        aadhaar_no: user.aadhaar_no || '',
        profile_picture: user.profile_picture || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const validation = validateImageFile(file);
      if (validation.valid) {
        const compressedImage = await compressImage(file);
        setFormData(prev => ({
          ...prev,
          profile_picture: compressedImage
        }));
        alert('Profile picture uploaded successfully!');
      } else {
        alert(validation.message);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      alert('Error: User data not found');
      return;
    }

    setSaving(true);
    try {
      let updatedUser = null;
      
      if (role === 'area_manager') {
        updatedUser = updateAreaManager(user.id, formData);
      } else if (role === 'project_manager') {
        updatedUser = updateProjectManager(user.id, formData);
      } else if (role === 'social_worker') {
        updatedUser = updateSocialWorker(user.id, formData);
      }

      if (updatedUser) {
        alert('Profile updated successfully!');
        setEditing(false);
        if (onUpdate) {
          onUpdate();
        }
      } else {
        alert('Error updating profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadIDCard = () => {
    // Create a canvas to render the ID card
    const idCardElement = document.querySelector('.id-card');
    if (!idCardElement) {
      alert('ID Card not found');
      return;
    }

    // Convert image URL to base64 to ensure it's captured
    const imageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL('image/png');
            resolve(base64);
          } catch (e) {
            console.warn('Canvas conversion failed, using original URL:', e);
            resolve(url);
          }
        };
        
        img.onerror = () => {
          console.warn('Image load failed, using original URL:', url);
          resolve(url);
        };
        
        // Try loading with CORS
        img.crossOrigin = 'anonymous';
        img.src = url;
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (!img.complete) {
            resolve(url);
          }
        }, 5000);
      });
    };

    // Wait for all images to load and convert external URLs to base64
    const waitForImages = async (element) => {
      const images = element.querySelectorAll('img');
      if (images.length === 0) {
        return;
      }

      const imagePromises = Array.from(images).map(async (img) => {
        // If image is already loaded and from same origin, skip
        if (img.complete && img.naturalHeight !== 0) {
          // Check if it's an external URL
          try {
            const url = new URL(img.src);
            if (url.origin !== window.location.origin && !img.src.startsWith('data:')) {
              // Convert external URL to base64
              const base64 = await imageToBase64(img.src);
              img.src = base64;
              // Wait for new image to load
              return new Promise((resolve) => {
                const newImg = new Image();
                newImg.onload = resolve;
                newImg.onerror = resolve;
                newImg.src = base64;
                setTimeout(resolve, 1000);
              });
            }
          } catch (e) {
            // If URL parsing fails, try to convert anyway
            if (!img.src.startsWith('data:') && img.src.startsWith('http')) {
              try {
                const base64 = await imageToBase64(img.src);
                img.src = base64;
                return new Promise((resolve) => {
                  const newImg = new Image();
                  newImg.onload = resolve;
                  newImg.onerror = resolve;
                  newImg.src = base64;
                  setTimeout(resolve, 1000);
                });
              } catch (err) {
                console.warn('Failed to convert image to base64:', err);
              }
            }
          }
        } else {
          // Wait for image to load
          return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 3000);
            }
          });
        }
      });

      await Promise.all(imagePromises);
      
      // Additional wait to ensure all images are rendered
      await new Promise(resolve => setTimeout(resolve, 200));
    };

    // Try to use html2canvas if available, otherwise use print
    const tryDownload = async () => {
      try {
        // Wait for images to load
        await waitForImages(idCardElement);
        
        // Small delay to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the computed background color
        const computedStyle = window.getComputedStyle(idCardElement);
        const bgColor = computedStyle.background || computedStyle.backgroundColor || '#1e3c72';
        
        // Use html2canvas (imported at top)
        const html2canvasFn = html2canvas.default || html2canvas;
        
        html2canvasFn(idCardElement, {
          backgroundColor: null, // Use transparent to capture gradients
          scale: 3, // Higher scale for better quality
          logging: false,
          useCORS: true,
          allowTaint: true, // Allow cross-origin images
          foreignObjectRendering: false, // Disable for better compatibility
          removeContainer: false,
          imageTimeout: 15000, // Wait up to 15 seconds for images
          width: idCardElement.offsetWidth,
          height: idCardElement.offsetHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc, element) => {
            // Ensure all images and layers are captured
            const clonedCard = clonedDoc.querySelector('.id-card');
            if (clonedCard) {
              // Make sure card is visible
              clonedCard.style.visibility = 'visible';
              clonedCard.style.opacity = '1';
              clonedCard.style.display = 'block';
              
              // Ensure gradients and backgrounds are captured
              const style = clonedCard.style;
              style.transform = 'none';
              style.transformOrigin = 'initial';
              style.transition = 'none';
              style.position = 'relative';
              
              // Fix all images in cloned document
              const images = clonedCard.querySelectorAll('img');
              images.forEach(img => {
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
                
                // Ensure base64 images are preserved
                if (img.src && img.src.startsWith('data:')) {
                  // Base64 image is already set, ensure it's visible
                  img.style.width = img.style.width || img.width + 'px';
                  img.style.height = img.style.height || img.height + 'px';
                } else if (!img.complete || img.naturalHeight === 0) {
                  // Try to reload if not loaded
                  if (img.src && img.src !== '') {
                    const newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    newImg.src = img.src;
                    newImg.onload = () => {
                      img.src = newImg.src;
                    };
                  }
                }
              });
              
              // Ensure all text is visible
              const allElements = clonedCard.querySelectorAll('*');
              allElements.forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
              });
            }
          }
        }).then(canvas => {
          // Check if canvas has content
          if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas is empty');
          }
          
          // Create a new canvas with proper background
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = canvas.width;
          finalCanvas.height = canvas.height;
          const ctx = finalCanvas.getContext('2d');
          
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, finalCanvas.width, finalCanvas.height);
          gradient.addColorStop(0, '#1e3c72');
          gradient.addColorStop(0.5, '#2a5298');
          gradient.addColorStop(1, '#4a7bc8');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
          
          // Draw the captured canvas on top
          ctx.drawImage(canvas, 0, 0);
          
          // Convert canvas to image
          const imgData = finalCanvas.toDataURL('image/png', 1.0);
          
          // Create download link
          const link = document.createElement('a');
          const fileName = `${(user.name || 'ID_Card').replace(/\s+/g, '_')}_${(user.id_no || 'ID').replace(/\s+/g, '_')}.png`;
          link.download = fileName;
          link.href = imgData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(error => {
          console.error('Error generating ID card image:', error);
          alert('Error generating ID card. Please try again or use print option.');
          // Fallback to print
          window.print();
        });
      } catch (error) {
        console.error('Error loading html2canvas:', error);
        alert('Download feature requires html2canvas package. Using print instead.');
        window.print();
      }
    };

    tryDownload();
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>My Profile</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'view' ? 'tab-active' : ''}
            onClick={() => setActiveTab('view')}
          >
            View Profile
          </button>
          <button 
            className={activeTab === 'edit' ? 'tab-active' : ''}
            onClick={() => setActiveTab('edit')}
          >
            Edit Profile
          </button>
          <button 
            className={activeTab === 'idcard' ? 'tab-active' : ''}
            onClick={() => setActiveTab('idcard')}
          >
            ID Card
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'view' && (
            <div className="profile-view">
              <div className="profile-view-header">
                <div className="profile-picture-large">
                  <img 
                    src={user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200`}
                    alt={user.name}
                  />
                </div>
                <div className="profile-view-info">
                  <h2>{user.name}</h2>
                  <p className="profile-role-label">{role === 'area_manager' ? 'Area Manager' : role === 'project_manager' ? 'Project Manager' : role === 'social_worker' ? 'Social Worker' : 'Admin'}</p>
                  {user.id_no && <p className="profile-id-no">{user.id_no}</p>}
                </div>
              </div>

              <div className="profile-details-grid">
                {user.email && (
                  <div className="profile-detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="profile-detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="profile-detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{user.address}</span>
                  </div>
                )}
                {user.state && (
                  <div className="profile-detail-item">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{user.state}</span>
                  </div>
                )}
                {user.district && (
                  <div className="profile-detail-item">
                    <span className="detail-label">District:</span>
                    <span className="detail-value">{user.district}</span>
                  </div>
                )}
                {user.aadhaar_no && (
                  <div className="profile-detail-item">
                    <span className="detail-label">Aadhaar No:</span>
                    <span className="detail-value">{user.aadhaar_no}</span>
                  </div>
                )}
                {user.bio && (
                  <div className="profile-detail-item full-width">
                    <span className="detail-label">Bio:</span>
                    <span className="detail-value">{user.bio}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="profile-edit">
              <form className="profile-edit-form">
                <div className="form-group">
                  <label>Profile Picture</label>
                  <div className="profile-picture-upload">
                    <img 
                      src={formData.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&size=200`}
                      alt="Profile"
                      className="profile-picture-preview"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      disabled={uploading}
                    />
                    {uploading && <p className="upload-status">Uploading...</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Aadhaar No</label>
                  <input
                    type="text"
                    name="aadhaar_no"
                    value={formData.aadhaar_no}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        bio: user.bio || '',
                        aadhaar_no: user.aadhaar_no || '',
                        profile_picture: user.profile_picture || ''
                      });
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'idcard' && (
            <div className="profile-idcard">
              <div className="idcard-container">
                <IDCard user={user} role={role} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;


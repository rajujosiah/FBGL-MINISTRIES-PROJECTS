import React, { useState, useEffect } from 'react';
import { 
  getAreaManagers, 
  assignStateDistrictToAreaManager,
  addAreaManager,
  updateAreaManager,
  deleteAreaManager,
  ConnectionError as DataConnectionError
} from '../../utils/dataManager';
import { INDIAN_STATES, STATE_DISTRICTS, getDistrictsForState, getStateCode, getDistrictCode } from '../../utils/stateDistricts';
import { convertFileToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import IDCard from '../IDCard';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const ManageAreaManagers = ({ onUpdate }) => {
  const [areaManagers, setAreaManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    aadhaar_no: '',
    bio: '',
    profile_picture: ''
  });
  const [showIDCard, setShowIDCard] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    loadAreaManagers();
  }, []);

  const loadAreaManagers = async () => {
    try {
      setConnectionError(null);
      const managers = await getAreaManagers();
      setAreaManagers(Array.isArray(managers) ? managers : []);
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to load area managers. Please check your internet connection.');
      }
      setAreaManagers([]);
    }
  };

  const handleAssign = async (managerId, state, district) => {
    try {
      setConnectionError(null);
      await assignStateDistrictToAreaManager(managerId, state, district);
      await loadAreaManagers();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to assign state/district. Please check your internet connection.');
      }
    }
  };

  const handleStateChange = (state) => {
    setFormData({ ...formData, state, district: '' });
    setAvailableDistricts(getDistrictsForState(state));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadingImage(true);
    try {
      const compressedImage = await compressImage(file);
      setFormData({ ...formData, profile_picture: compressedImage });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setConnectionError(null);
      if (selectedManager) {
        await updateAreaManager(selectedManager.id, formData);
      } else {
      // Generate ID No
      const stateCode = getStateCode(formData.state);
      const districtCode = getDistrictCode(formData.district);
      const count = areaManagers.filter(am => 
        am.state === formData.state && am.district === formData.district
      ).length + 1;
      const id_no = `FBGL ${stateCode} ${districtCode} A${count.toString().padStart(2, '0')}`;
      
      const profilePicture = formData.profile_picture || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1e3c72&color=fff&size=200`;
      
      await addAreaManager({
        ...formData,
        id_no,
        profile_picture: profilePicture,
        area_manager: `${formData.state} - ${formData.district}`
      });
    }
    setShowForm(false);
    setFormData({ name: '', state: '', district: '', address: '', phone: '', email: '', aadhaar_no: '', bio: '', profile_picture: '' });
      setSelectedManager(null);
      setAvailableDistricts([]);
      await loadAreaManagers();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to save area manager. Please check your internet connection.');
      }
    }
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setFormData({
      name: manager.name,
      state: manager.state || '',
      district: manager.district || '',
      address: manager.address || '',
      phone: manager.phone || '',
      email: manager.email || '',
      aadhaar_no: manager.aadhaar_no || '',
      bio: manager.bio || '',
      profile_picture: manager.profile_picture || ''
    });
    if (manager.state) {
      setAvailableDistricts(getDistrictsForState(manager.state));
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Area Manager?')) {
      try {
        setConnectionError(null);
        await deleteAreaManager(id);
        await loadAreaManagers();
        onUpdate?.();
      } catch (error) {
        if (error instanceof DataConnectionError) {
          setConnectionError(error.message);
        } else {
          setConnectionError('Failed to delete area manager. Please check your internet connection.');
        }
      }
    }
  };

  const handleViewIDCard = (manager) => {
    setSelectedManager(manager);
    setShowIDCard(true);
  };

  return (
    <div className="manage-section">
      {connectionError && (
        <ConnectionError 
          message={connectionError} 
          onRetry={loadAreaManagers}
        />
      )}
      
      <div className="section-header">
        <div>
          <h2>Step 1: Manage Area Managers</h2>
          <p className="section-description" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <strong>How it works:</strong> First, create Area Managers and assign them a State and District. 
            This determines which geographic area they will be responsible for. 
            After this step, you can assign Project Managers to work under these Area Managers.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedManager(null); }}>
          + Add Area Manager
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>{selectedManager ? 'Edit Area Manager' : 'Add Area Manager'}</h3>
              <button className="close-btn" onClick={() => { setShowForm(false); setSelectedManager(null); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Profile Picture</label>
                {formData.profile_picture && (
                  <div className="image-preview">
                    <img src={formData.profile_picture} alt="Profile" />
                    <button type="button" onClick={() => setFormData({ ...formData, profile_picture: '' })}>Remove</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="upload-status">Uploading image...</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                    disabled={!formData.state || availableDistricts.length === 0}
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {!formData.state && <p className="field-hint">Please select a state first</p>}
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Aadhaar No</label>
                  <input
                    type="text"
                    value={formData.aadhaar_no}
                    onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedManager(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIDCard && selectedManager && (
        <div className="modal-overlay" onClick={() => setShowIDCard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ID Card</h3>
              <button className="close-btn" onClick={() => setShowIDCard(false)}>×</button>
            </div>
            <IDCard user={selectedManager} role="area_manager" />
          </div>
        </div>
      )}

      <div className="managers-grid">
        {areaManagers.map(manager => (
          <div key={manager.id} className="manager-card">
            <div className="manager-header">
              <img 
                src={manager.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(manager.name)}&background=1e3c72&color=fff&size=200`}
                alt={manager.name}
                className="manager-photo"
              />
              <div className="manager-info">
                <h3>{manager.name}</h3>
                <p className="manager-id">{manager.id_no}</p>
              </div>
            </div>
            <div className="manager-details">
              {manager.state && manager.district ? (
                <>
                  <p><strong>State:</strong> {manager.state}</p>
                  <p><strong>District:</strong> {manager.district}</p>
                </>
              ) : (
                <p className="no-assignment">No State/District assigned</p>
              )}
              {manager.phone && <p><strong>Phone:</strong> {manager.phone}</p>}
              {manager.email && <p><strong>Email:</strong> {manager.email}</p>}
            </div>
            <div className="manager-actions">
              <button className="btn-small btn-primary" onClick={() => handleViewIDCard(manager)}>
                View ID Card
              </button>
              <button className="btn-small btn-secondary" onClick={() => handleEdit(manager)}>
                Edit
              </button>
              <button className="btn-small btn-danger" onClick={() => handleDelete(manager.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {areaManagers.length === 0 && (
        <p className="empty-state">No Area Managers found. Add one to get started.</p>
      )}
    </div>
  );
};

export default ManageAreaManagers;


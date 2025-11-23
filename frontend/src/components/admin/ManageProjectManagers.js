import React, { useState, useEffect } from 'react';
import {
  getAreaManagers,
  getProjectManagers,
  addProjectManager,
  updateProjectManager,
  deleteProjectManager,
  ConnectionError as DataConnectionError
} from '../../utils/dataManager';
import { INDIAN_STATES, STATE_DISTRICTS, getDistrictsForState, getStateCode, getDistrictCode } from '../../utils/stateDistricts';
import { convertFileToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import IDCard from '../IDCard';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const ManageProjectManagers = ({ onUpdate }) => {
  const [projectManagers, setProjectManagers] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    area_manager_id: '',
    state: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    aadhaar_no: '',
    bio: '',
    profile_picture: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [showIDCard, setShowIDCard] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setConnectionError(null);
      const [managers, areas] = await Promise.all([
        getProjectManagers(),
        getAreaManagers()
      ]);
      setProjectManagers(Array.isArray(managers) ? managers : []);
      setAreaManagers(Array.isArray(areas) ? areas : []);
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to load data. Please check your internet connection.');
      }
      setProjectManagers([]);
      setAreaManagers([]);
    }
  };

  const handleStateChange = (state) => {
    setFormData({ ...formData, state, district: '' });
    setAvailableDistricts(getDistrictsForState(state));
  };

  const handleAreaManagerChange = (areaManagerId) => {
    const areaManager = areaManagers.find(am => am.id.toString() === areaManagerId);
    if (areaManager) {
      setFormData({
        ...formData,
        area_manager_id: areaManagerId,
        state: areaManager.state || '',
        district: areaManager.district || ''
      });
      if (areaManager.state) {
        setAvailableDistricts(getDistrictsForState(areaManager.state));
      }
    } else {
      setFormData({ ...formData, area_manager_id: areaManagerId });
    }
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
        await updateProjectManager(selectedManager.id, formData);
      } else {
        // Generate ID No
        const stateCode = getStateCode(formData.state);
        const districtCode = getDistrictCode(formData.district);
        const count = projectManagers.filter(pm =>
          pm.state === formData.state && pm.district === formData.district
        ).length + 1;
        const id_no = `FBGL${stateCode}${districtCode}P${count.toString().padStart(2, '0')}`;

        const profilePicture = formData.profile_picture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2a5298&color=fff&size=200`;

        // Use provided password or generate one if empty (fallback)
        const password = formData.password || Math.random().toString(36).slice(-8);
        setGeneratedPassword(password);

        await addProjectManager({
          ...formData,
          id_no,
          profile_picture: profilePicture,
          area_manager_id: formData.area_manager_id ? parseInt(formData.area_manager_id) : null,
          password: password
        });
      }
      setShowForm(false);
      setFormData({
        name: '',
        area_manager_id: '',
        state: '',
        district: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        aadhaar_no: '',
        bio: '',
        profile_picture: ''
      });
      setSelectedManager(null);
      setAvailableDistricts([]);
      await loadData();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to save project manager. Please check your internet connection.');
      }
    }
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setFormData({
      name: manager.name,
      area_manager_id: manager.area_manager_id || '',
      state: manager.state || '',
      district: manager.district || '',
      address: manager.address || '',
      phone: manager.phone || '',
      email: manager.email || '',
      password: '', // Don't populate password on edit
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
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);

    try {
      setConnectionError(null);
      await deleteProjectManager(id);
      alert('Project Manager deleted successfully!');
      await loadData();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        alert(`Failed to delete project manager: ${error.message || 'Unknown error'}`);
        setConnectionError('Failed to delete project manager. Please check your internet connection.');
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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
          onRetry={loadData}
        />
      )}

      {generatedPassword && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>Project Manager Created</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>The project manager has been created successfully.</p>
              <p>Please share the following password with the user:</p>
              <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>{generatedPassword}</p>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={() => setGeneratedPassword(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="section-header">
        <div>
          <h2>Manage Project Managers</h2>
          <p className="section-description" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Create and manage Project Managers. You can assign them to Area Managers and specify their State and District.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedManager(null); }}>
          + Add Project Manager
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>{selectedManager ? 'Edit Project Manager' : 'Add Project Manager'}</h3>
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
                  <label>Area Manager</label>
                  <select
                    value={formData.area_manager_id}
                    onChange={(e) => handleAreaManagerChange(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {areaManagers.map(am => (
                      <option key={am.id} value={am.id}>
                        {am.name} ({am.state} - {am.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
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
                {!selectedManager && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                )}
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
            <IDCard user={selectedManager} role="project_manager" />
          </div>
        </div>
      )}

      <div className="managers-grid">
        {projectManagers.map(manager => {
          const assignedAreaManager = areaManagers.find(am => am.id === manager.area_manager_id);
          return (
            <div key={manager.id} className="manager-card">
              <div className="manager-header">
                <img
                  src={manager.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(manager.name)}&background=2a5298&color=fff&size=200`}
                  alt={manager.name}
                  className="manager-photo"
                />
                <div className="manager-info">
                  <h3>{manager.name}</h3>
                  <p className="manager-id">{manager.id_no}</p>
                </div>
              </div>
              <div className="manager-details">
                {assignedAreaManager && (
                  <p><strong>Assigned to:</strong> {assignedAreaManager.name}</p>
                )}
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
          );
        })}
      </div>

      {projectManagers.length === 0 && (
        <p className="empty-state">No Project Managers found. Add one to get started.</p>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>Are you sure you want to delete this Project Manager?</p>
              <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: '1rem' }}>This action cannot be undone.</p>
            </div>
            <div className="form-actions">
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjectManagers;


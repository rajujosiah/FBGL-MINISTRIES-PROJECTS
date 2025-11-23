import React, { useState, useEffect } from 'react';
import {
  getProjectManagers,
  getSocialWorkers,
  addSocialWorker,
  updateSocialWorker,
  deleteSocialWorker,
  ConnectionError as DataConnectionError
} from '../../utils/dataManager';
import { INDIAN_STATES, STATE_DISTRICTS, getDistrictsForState, getStateCode, getDistrictCode } from '../../utils/stateDistricts';
import { convertFileToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import IDCard from '../IDCard';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const ManageSocialWorkers = ({ onUpdate }) => {
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    project_manager_id: '',
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
      const [workers, managers] = await Promise.all([
        getSocialWorkers(),
        getProjectManagers()
      ]);
      setSocialWorkers(Array.isArray(workers) ? workers : []);
      setProjectManagers(Array.isArray(managers) ? managers : []);
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to load data. Please check your internet connection.');
      }
      setSocialWorkers([]);
      setProjectManagers([]);
    }
  };

  const handleStateChange = (state) => {
    setFormData({ ...formData, state, district: '' });
    setAvailableDistricts(getDistrictsForState(state));
  };

  const handleProjectManagerChange = (projectManagerId) => {
    const projectManager = projectManagers.find(pm => pm.id.toString() === projectManagerId);
    if (projectManager) {
      setFormData({
        ...formData,
        project_manager_id: projectManagerId,
        state: projectManager.state || '',
        district: projectManager.district || ''
      });
      if (projectManager.state) {
        setAvailableDistricts(getDistrictsForState(projectManager.state));
      }
    } else {
      setFormData({ ...formData, project_manager_id: projectManagerId });
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
      if (selectedWorker) {
        await updateSocialWorker(selectedWorker.id, formData);
      } else {
        // Generate ID No
        const stateCode = getStateCode(formData.state);
        const districtCode = getDistrictCode(formData.district);
        const count = socialWorkers.filter(sw =>
          sw.state === formData.state && sw.district === formData.district
        ).length + 1;
        const id_no = `FBGL${stateCode}${districtCode}S${count.toString().padStart(2, '0')}`;

        const profilePicture = formData.profile_picture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3d7aa8&color=fff&size=200`;

        // Use provided password or generate one if empty (fallback)
        const password = formData.password || Math.random().toString(36).slice(-8);
        setGeneratedPassword(password);


        await addSocialWorker({
          ...formData,
          id_no,
          profile_picture: profilePicture,
          project_manager_id: formData.project_manager_id ? parseInt(formData.project_manager_id) : null,
          password: password
        });
      }
      setShowForm(false);
      setFormData({
        name: '',
        project_manager_id: '',
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
      setSelectedWorker(null);
      setAvailableDistricts([]);
      await loadData();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to save social worker. Please check your internet connection.');
      }
    }
  };

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    setFormData({
      name: worker.name,
      project_manager_id: worker.project_manager_id || '',
      state: worker.state || '',
      district: worker.district || '',
      address: worker.address || '',
      phone: worker.phone || '',
      email: worker.email || '',
      password: '', // Don't populate password on edit
      aadhaar_no: worker.aadhaar_no || '',
      bio: worker.bio || '',
      profile_picture: worker.profile_picture || ''
    });
    if (worker.state) {
      setAvailableDistricts(getDistrictsForState(worker.state));
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
      await deleteSocialWorker(id);
      alert('Social Worker deleted successfully!');
      await loadData();
      onUpdate?.();
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        alert(`Failed to delete social worker: ${error.message || 'Unknown error'}`);
        setConnectionError('Failed to delete social worker. Please check your internet connection.');
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleViewIDCard = (worker) => {
    setSelectedWorker(worker);
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
              <h3>Social Worker Created</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>The social worker has been created successfully.</p>
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
          <h2>Manage Social Workers</h2>
          <p className="section-description" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Create and manage Social Workers. You can assign them to Project Managers and specify their State and District.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedWorker(null); }}>
          + Add Social Worker
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>{selectedWorker ? 'Edit Social Worker' : 'Add Social Worker'}</h3>
              <button className="close-btn" onClick={() => { setShowForm(false); setSelectedWorker(null); }}>×</button>
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
                  <label>Project Manager</label>
                  <select
                    value={formData.project_manager_id}
                    onChange={(e) => handleProjectManagerChange(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {projectManagers.map(pm => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name} ({pm.state} - {pm.district})
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
                {!selectedWorker && (
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
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedWorker(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIDCard && selectedWorker && (
        <div className="modal-overlay" onClick={() => setShowIDCard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ID Card</h3>
              <button className="close-btn" onClick={() => setShowIDCard(false)}>×</button>
            </div>
            <IDCard user={selectedWorker} role="social_worker" />
          </div>
        </div>
      )}

      <div className="managers-grid">
        {socialWorkers.map(worker => {
          const assignedProjectManager = projectManagers.find(pm => pm.id === worker.project_manager_id);
          return (
            <div key={worker.id} className="manager-card">
              <div className="manager-header">
                <img
                  src={worker.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=3d7aa8&color=fff&size=200`}
                  alt={worker.name}
                  className="manager-photo"
                />
                <div className="manager-info">
                  <h3>{worker.name}</h3>
                  <p className="manager-id">{worker.id_no}</p>
                </div>
              </div>
              <div className="manager-details">
                {assignedProjectManager && (
                  <p><strong>Assigned to:</strong> {assignedProjectManager.name}</p>
                )}
                {worker.state && worker.district ? (
                  <>
                    <p><strong>State:</strong> {worker.state}</p>
                    <p><strong>District:</strong> {worker.district}</p>
                  </>
                ) : (
                  <p className="no-assignment">No State/District assigned</p>
                )}
                {worker.phone && <p><strong>Phone:</strong> {worker.phone}</p>}
                {worker.email && <p><strong>Email:</strong> {worker.email}</p>}
              </div>
              <div className="manager-actions">
                <button className="btn-small btn-primary" onClick={() => handleViewIDCard(worker)}>
                  View ID Card
                </button>
                <button className="btn-small btn-secondary" onClick={() => handleEdit(worker)}>
                  Edit
                </button>
                <button className="btn-small btn-danger" onClick={() => handleDelete(worker.id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {socialWorkers.length === 0 && (
        <p className="empty-state">No Social Workers found. Add one to get started.</p>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>Are you sure you want to delete this Social Worker?</p>
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

export default ManageSocialWorkers;


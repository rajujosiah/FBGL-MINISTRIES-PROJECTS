import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects, updateProject, addProjectImages, initializeData, getSocialWorkers } from '../../utils/dataManager';
import { convertMultipleFilesToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import ProfileModal from '../../components/ProfileModal';
import { IoMdPerson, IoMdImages, IoMdMap, IoMdPeople, IoMdDocument, IoMdCheckmarkCircle, IoMdRefresh, IoMdHourglass } from 'react-icons/io';
import './Dashboard.css';
import '../../components/admin/AdminComponents.css';

const SocialWorkerDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [socialWorker, setSocialWorker] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    beneficiaries: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Initialize data to ensure sample data is loaded
      await initializeData();

      // Get all social workers (now async)
      const allWorkers = await getSocialWorkers();

      if (allWorkers.length === 0) {
        console.error('No social workers found');
        setLoading(false);
        return;
      }

      // Try multiple matching strategies
      let foundWorker = null;

      // Strategy 1: Match by username (could be ID no or email)
      foundWorker = allWorkers.find(sw =>
        (sw.id_no && sw.id_no.replace(/\s+/g, '').toUpperCase() === user.username.toUpperCase()) ||
        (sw.email && sw.email.toLowerCase() === user.username.toLowerCase()) ||
        (sw.email && sw.email.toLowerCase() === (user.username + '@fbgl.org').toLowerCase()) ||
        (sw.id && sw.id.toString() === user.username)
      );

      // Strategy 2: If using generic 'socialworker' login, use first available worker
      if (!foundWorker && (user.username === 'socialworker' || user.username === 'social_worker') && allWorkers.length > 0) {
        foundWorker = allWorkers[0]; // Use first social worker for demo
      }

      // Strategy 3: Match by role and use first social worker
      if (!foundWorker && user.role === 'social_worker' && allWorkers.length > 0) {
        foundWorker = allWorkers[0]; // Use first social worker as fallback
      }

      // Strategy 4: Fallback to first worker if nothing matches
      if (!foundWorker && allWorkers.length > 0) {
        foundWorker = allWorkers[0];
      }

      if (foundWorker) {
        setSocialWorker(foundWorker);

        // Load projects assigned to this Social Worker (now async)
        const workerProjects = await getProjects({ socialWorkerId: foundWorker.id });
        setProjects(workerProjects || []);

        setStats({
          total: (workerProjects || []).length,
          inProgress: (workerProjects || []).filter(p => p.status === 'ongoing' || p.status === 'Ongoing').length,
          completed: (workerProjects || []).filter(p => p.status === 'completed' || p.status === 'Completed').length,
          beneficiaries: 0 // Can be calculated from projects
        });
      } else {
        console.error('Social Worker not found for user:', user);
      }
    } catch (error) {
      console.error('Error loading social worker data:', error);
      alert('Error loading dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedProject) return;

    setUploading(true);
    try {
      const validFiles = [];
      for (const file of files) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          const compressed = await compressImage(file);
          validFiles.push(compressed);
        }
      }

      if (validFiles.length > 0) {
        const currentImages = selectedProject.images || [];
        await updateProject(selectedProject.id, {
          images: [...currentImages, ...validFiles]
        });
        loadData();
        setShowImageUpload(false);
        setSelectedProject(null);
        alert(`Successfully uploaded ${validFiles.length} image(s)!`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-message">
            <h2>Loading Dashboard...</h2>
            <p>Please wait while we load your data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!socialWorker) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-message">
            <h2>Access Denied</h2>
            <p>Social Worker profile not found. Please contact the administrator.</p>
            <p className="debug-info">Username: {user?.username}, Role: {user?.role}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Social Worker Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{socialWorker.name}</strong>!</p>
            <p className="location-info">{socialWorker.state} - {socialWorker.district}</p>
          </div>
          <div className="dashboard-info">
            <span className="role-badge role-social-worker">Social Worker</span>
            <span className="user-info">{socialWorker.id_no}</span>
          </div>
        </div>

        <div className="dashboard-section" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            onClick={() => setShowProfile(true)}
          >
            <IoMdPerson style={{ marginRight: '0.5rem' }} /> My Profile
          </button>
        </div>

        {showProfile && socialWorker && (
          <ProfileModal
            user={socialWorker}
            role="social_worker"
            onClose={() => setShowProfile(false)}
            onUpdate={() => {
              loadData();
              setShowProfile(false);
            }}
          />
        )}

        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
              <p className="section-description">
                Complete overview of your assigned projects and progress.
              </p>
            </div>
            <div className="stats-grid">
              <div className="stat-card enhanced-stat-card">
                <div className="stat-icon-wrapper">
                  <IoMdDocument className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3>My Projects</h3>
                  <p className="stat-number">{stats.total}</p>
                  <p className="stat-description">Total assigned</p>
                </div>
              </div>
              <div className="stat-card enhanced-stat-card">
                <div className="stat-icon-wrapper">
                  <IoMdRefresh className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3>In Progress</h3>
                  <p className="stat-number">{stats.inProgress}</p>
                  <p className="stat-description">Active projects</p>
                </div>
              </div>
              <div className="stat-card enhanced-stat-card">
                <div className="stat-icon-wrapper">
                  <IoMdCheckmarkCircle className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p className="stat-number">{stats.completed}</p>
                  <p className="stat-description">Finished projects</p>
                </div>
              </div>
              <div className="stat-card enhanced-stat-card">
                <div className="stat-icon-wrapper">
                  <IoMdImages className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3>Images Uploaded</h3>
                  <p className="stat-number">
                    {projects.reduce((sum, p) => sum + (p.images?.length || 0), 0)}
                  </p>
                  <p className="stat-description">Total photos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Projects</h2>
              <p className="section-description">
                Manage your assigned projects, upload images, and update project status.
              </p>
            </div>
            {projects.length > 0 ? (
              <div className="projects-list">
                {projects.map(project => (
                  <div key={project.id} className="enhanced-project-card">
                    <div className="project-card-header">
                      <div className="project-title-section">
                        <h3>{project.title}</h3>
                        {project.category && (
                          <span className={`category-tag category-tag-${project.category}`}>
                            {project.category}
                          </span>
                        )}
                      </div>
                      <span className={`status-badge status-${(project.status || 'upcoming').toLowerCase()}`}>
                        {(project.status || 'Upcoming').charAt(0).toUpperCase() + (project.status || 'Upcoming').slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="project-card-body">
                      <p className="project-card-description">{project.description}</p>

                      {project.location && (
                        <div className="project-card-details-grid">
                          <div className="detail-item">
                            <IoMdMap className="detail-icon" />
                            <div className="detail-content">
                              <span className="detail-label">Location</span>
                              <span className="detail-value">{project.location}</span>
                            </div>
                          </div>

                          {project.target_beneficiaries && (
                            <div className="detail-item">
                              <IoMdPeople className="detail-icon" />
                              <div className="detail-content">
                                <span className="detail-label">Beneficiaries</span>
                                <span className="detail-value">{project.target_beneficiaries}</span>
                              </div>
                            </div>
                          )}

                          {project.images && project.images.length > 0 && (
                            <div className="detail-item">
                              <IoMdImages className="detail-icon" />
                              <div className="detail-content">
                                <span className="detail-label">Images</span>
                                <span className="detail-value">{project.images.length} photo{project.images.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {project.images && project.images.length > 0 && (
                        <div className="project-item-images" style={{ marginTop: '1rem' }}>
                          <div className="project-images-grid">
                            {project.images.slice(0, 4).map((img, index) => (
                              <img key={index} src={img} alt={`${project.title} - ${index + 1}`} />
                            ))}
                          </div>
                          {project.images.length > 4 && (
                            <p className="images-count">+{project.images.length - 4} more images</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="project-card-footer">
                      <div className="project-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📅</span>
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="project-card-actions">
                        <Link
                          to={`/projects/${project.id}`}
                          className="btn-small btn-primary"
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        >
                          <IoMdDocument style={{ marginRight: '0.5rem' }} /> Manage Project
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-enhanced">
                <IoMdDocument className="empty-icon" />
                <h3>No Projects Assigned</h3>
                <p>No projects have been assigned to you yet. Contact your Project Manager.</p>
              </div>
            )}
          </div>
        </div>

        {showImageUpload && selectedProject && (
          <div className="modal-overlay" onClick={() => { setShowImageUpload(false); setSelectedProject(null); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Images for: {selectedProject.title}</h3>
                <button className="close-btn" onClick={() => { setShowImageUpload(false); setSelectedProject(null); }}>×</button>
              </div>
              <div className="image-upload-form">
                <p className="upload-description">
                  Select images to upload. You can select multiple images at once (JPG, PNG, GIF formats supported).
                </p>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="file-input"
                    id="project-image-upload"
                  />
                  <label htmlFor="project-image-upload" className="file-input-label">
                    {uploading ? 'Uploading...' : <><IoMdImages style={{ marginRight: '0.5rem' }} /> Choose Images</>}
                  </label>
                </div>
                {uploading && (
                  <div className="upload-status">
                    <p><IoMdHourglass style={{ marginRight: '0.5rem' }} /> Uploading and compressing images... Please wait.</p>
                  </div>
                )}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="existing-images">
                    <h4>Current Images ({selectedProject.images.length})</h4>
                    <div className="existing-images-grid">
                      {selectedProject.images.map((img, index) => (
                        <div key={index} className="existing-image-item">
                          <img src={img} alt={`Image ${index + 1}`} />
                          <span className="image-number">#{index + 1}</span>
                        </div>
                      ))}
                    </div>
                    <p className="images-note">New images will be added to the existing collection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialWorkerDashboard;


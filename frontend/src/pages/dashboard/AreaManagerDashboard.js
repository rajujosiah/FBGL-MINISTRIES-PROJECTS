import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getProjectManagers, 
  getProjects, 
  getAreaManagers,
  getSocialWorkers,
  addProject,
  updateProject,
  assignProjectToProjectManager,
  initializeData
} from '../../utils/dataManager';
import { validateImageFile, compressImage } from '../../utils/imageUtils';
import ProfileModal from '../../components/ProfileModal';
import { IoMdPerson, IoMdPeople, IoMdDocument, IoMdCheckmarkCircle, IoMdStats, IoMdMap, IoMdImages, IoMdCreate, IoMdBriefcase } from 'react-icons/io';
import './Dashboard.css';
import '../../components/admin/AdminComponents.css';

const AreaManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectManagers, setProjectManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [areaManager, setAreaManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social',
    area_of_operation: '',
    location: '',
    target_beneficiaries: '',
    status: 'upcoming',
    project_manager_id: '',
    images: []
  });

  useEffect(() => {
    // Initialize data first
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
      
      // Get all area managers (now async)
      const areaManagers = await getAreaManagers();
      
      if (areaManagers.length === 0) {
        console.error('No area managers found');
        setLoading(false);
        return;
      }
      
      // Try multiple matching strategies
      let foundAM = null;
      
      // Strategy 1: Match by username (could be ID no or email)
      foundAM = areaManagers.find(am => 
        am.id_no && am.id_no.replace(/\s+/g, '').toUpperCase() === user.username.toUpperCase() ||
        am.email && am.email.toLowerCase() === user.username.toLowerCase() ||
        am.id && am.id.toString() === user.username
      );
      
      // Strategy 2: If using generic 'areamanager' login, use first available area manager
      if (!foundAM && user.username === 'areamanager' && areaManagers.length > 0) {
        foundAM = areaManagers[0]; // Use first area manager for demo
      }
      
      // Strategy 3: Match by role and use first area manager
      if (!foundAM && user.role === 'area_manager' && areaManagers.length > 0) {
        foundAM = areaManagers[0]; // Use first area manager as fallback
      }
      
      if (foundAM) {
        setAreaManager(foundAM);
        // Load project managers assigned to this area manager (now async)
        const pms = await getProjectManagers(foundAM.id);
        setProjectManagers(pms || []);
        
        // Load all social workers under these project managers (now async)
        const allSocialWorkers = [];
        for (const pm of (pms || [])) {
          const sws = await getSocialWorkers(pm.id);
          if (sws && sws.length > 0) {
            allSocialWorkers.push(...sws);
          }
        }
        setSocialWorkers(allSocialWorkers);
        
        // Load projects assigned to these project managers (now async)
        const areaProjects = await getProjects({ areaManagerId: foundAM.id });
        setProjects(areaProjects || []);
      } else {
        console.error('Area manager not found for user:', user);
      }
    } catch (error) {
      console.error('Error loading area manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.project_manager_id) {
      alert('Please select a Project Manager to assign this project to.');
      return;
    }

    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    try {
      // Ensure project_manager_id is a number
      const projectData = {
        ...formData,
        project_manager_id: parseInt(formData.project_manager_id)
      };
      
      if (selectedProject) {
        await updateProject(selectedProject.id, projectData);
        alert('Project updated successfully!');
      } else {
        await addProject(projectData);
        alert('Project created and assigned successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'social',
        area_of_operation: '',
        location: '',
        target_beneficiaries: '',
        status: 'upcoming',
        project_manager_id: '',
        images: []
      });
      setShowProjectForm(false);
      setSelectedProject(null);
      
      // Reload data to refresh the UI
      loadData();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const validImages = [];
    
    try {
      for (const file of files) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          try {
            const compressedImage = await compressImage(file);
            validImages.push(compressedImage);
          } catch (error) {
            console.error('Error compressing image:', error);
          }
        }
      }

      if (validImages.length > 0) {
        const currentImages = Array.isArray(formData.images) ? formData.images : [];
        setFormData({ 
          ...formData, 
          images: [...currentImages, ...validImages] 
        });
        alert(`Successfully uploaded ${validImages.length} image(s)!`);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      alert('An error occurred during upload. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'social',
      area_of_operation: project.area_of_operation || '',
      location: project.location || '',
      target_beneficiaries: project.target_beneficiaries || '',
      status: project.status || 'upcoming',
      project_manager_id: project.project_manager_id || '',
      images: Array.isArray(project.images) ? project.images : []
    });
    setShowProjectForm(true);
  };

  const getProjectManagerName = (projectManagerId) => {
    const pm = projectManagers.find(p => p.id === projectManagerId);
    return pm ? pm.name : 'Unassigned';
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'ongoing': '#28a745',
      'completed': '#6c757d',
      'upcoming': '#ffc107'
    };
    return statusColors[status] || '#6c757d';
  };

  const stats = {
    projectManagers: projectManagers.length,
    socialWorkers: socialWorkers.length,
    activeProjects: projects.filter(p => p.status === 'ongoing').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    upcomingProjects: projects.filter(p => p.status === 'upcoming').length,
    totalProjects: projects.length,
    socialProjects: projects.filter(p => p.category === 'social').length,
    economyProjects: projects.filter(p => p.category === 'economy').length,
    educationProjects: projects.filter(p => p.category === 'education').length
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

  if (!areaManager) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-message">
            <h2>Access Denied</h2>
            <p>Area Manager profile not found. Please contact the administrator.</p>
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
            <h1>Area Manager Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{areaManager.name}</strong>!</p>
            <p className="location-info">{areaManager.state} - {areaManager.district}</p>
          </div>
          <div className="dashboard-info">
            <span className="role-badge role-area-manager">Area Manager</span>
            <span className="user-info">{areaManager.id_no}</span>
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

        {showProfile && areaManager && (
          <ProfileModal
            user={areaManager}
            role="area_manager"
            onClose={() => setShowProfile(false)}
            onUpdate={() => {
              loadData();
              setShowProfile(false);
            }}
          />
        )}

        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab-active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'project-managers' ? 'tab-active' : ''}
            onClick={() => setActiveTab('project-managers')}
          >
            Project Managers ({stats.projectManagers})
          </button>
          <button 
            className={activeTab === 'project-management' ? 'tab-active' : ''}
            onClick={() => setActiveTab('project-management')}
          >
            Project Management ({stats.projectManagers + projects.length})
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p className="section-description">Complete overview of your area management statistics and performance metrics.</p>
                </div>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdBriefcase className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Project Managers</h3>
                    <p className="stat-number">{stats.projectManagers}</p>
                    <p className="stat-description">Active team leaders</p>
                  </div>
                </div>
                
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdPeople className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Social Workers</h3>
                    <p className="stat-number">{stats.socialWorkers}</p>
                    <p className="stat-description">Field workers</p>
                  </div>
                </div>
                
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdDocument className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Active Projects</h3>
                    <p className="stat-number">{stats.activeProjects}</p>
                    <p className="stat-description">In progress</p>
                  </div>
                </div>
                
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdCheckmarkCircle className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Completed</h3>
                    <p className="stat-number">{stats.completedProjects}</p>
                    <p className="stat-description">Finished projects</p>
                  </div>
                </div>
                
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdStats className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Total Projects</h3>
                    <p className="stat-number">{stats.totalProjects}</p>
                    <p className="stat-description">All projects</p>
                  </div>
                </div>
                
              </div>

              <div className="actions-section">
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSelectedProject(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'social',
                      area_of_operation: '',
                      location: '',
                      target_beneficiaries: '',
                      status: 'upcoming',
                      project_manager_id: '',
                      images: []
                    });
                    setShowProjectForm(true);
                  }}
                >
                  + Create New Project
                </button>
              </div>
            </div>
          )}

          {activeTab === 'project-managers' && (
            <div className="dashboard-section">
              <h2>Assigned Project Managers</h2>
              {projectManagers.length > 0 ? (
                <div className="team-grid">
                  {projectManagers.map(pm => (
                    <div key={pm.id} className="team-card">
                      {pm.profile_picture && (
                        <img src={pm.profile_picture} alt={pm.name} className="team-card-image" />
                      )}
                      <div className="team-card-content">
                        <h3>{pm.name}</h3>
                        <p className="team-card-id">{pm.id_no}</p>
                        <p className="team-card-location">{pm.state} - {pm.district}</p>
                        <p className="team-card-email">{pm.email}</p>
                        <p className="team-card-phone">{pm.phone}</p>
                        <div className="team-card-stats">
                          <span>
                            Projects: {projects.filter(p => p.project_manager_id === pm.id).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No Project Managers assigned yet. Contact the administrator.</p>
              )}
            </div>
          )}

          {activeTab === 'project-management' && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h2>Project Management</h2>
                  <p className="section-description">
                    Manage projects and view detailed information about all Project Managers in your area.
                  </p>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSelectedProject(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'social',
                      area_of_operation: '',
                      location: '',
                      target_beneficiaries: '',
                      status: 'upcoming',
                      project_manager_id: '',
                      images: []
                    });
                    setShowProjectForm(true);
                  }}
                >
                  + Create New Project
                </button>
              </div>

              {/* Projects Section */}
              <div className="project-management-section">
                <div className="section-subheader">
                  <h3>
                    <IoMdDocument className="section-icon" />
                    Projects <span className="count-badge">{projects.length}</span>
                  </h3>
                  <div className="section-filters">
                    <select className="filter-select" onChange={(e) => {
                      // Add filter logic if needed
                    }}>
                      <option value="all">All Status</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>
                {projects.length > 0 ? (
                  <div className="projects-list">
                    {projects.map(project => {
                      const assignedPM = projectManagers.find(pm => pm.id === project.project_manager_id);
                      return (
                        <div key={project.id} className="project-card enhanced-project-card">
                          <div className="project-card-header">
                            <div className="project-title-section">
                              <h3>{project.title}</h3>
                              <span className={`category-tag category-tag-${project.category}`}>
                                {project.category}
                              </span>
                            </div>
                            <span 
                              className={`status-badge status-badge-${project.status}`}
                              style={{ backgroundColor: getStatusBadge(project.status) }}
                            >
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="project-card-body">
                            <p className="project-card-description">{project.description}</p>
                            
                            <div className="project-card-details-grid">
                              <div className="detail-item">
                                <IoMdPerson className="detail-icon" />
                                <div className="detail-content">
                                  <span className="detail-label">Assigned to</span>
                                  <span className="detail-value">{assignedPM?.name || 'Unassigned'}</span>
                                </div>
                              </div>
                              
                              {project.location && (
                                <div className="detail-item">
                                  <IoMdMap className="detail-icon" />
                                  <div className="detail-content">
                                    <span className="detail-label">Location</span>
                                    <span className="detail-value">{project.location}</span>
                                  </div>
                                </div>
                              )}
                              
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
                            
                            <div className="project-card-footer">
                              <div className="project-meta">
                                <span className="meta-item">
                                  <span className="meta-icon">📅</span>
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="project-card-actions">
                                <button 
                                  className="btn-small btn-secondary"
                                  onClick={() => handleEdit(project)}
                                >
                                  <IoMdCreate style={{ marginRight: '0.5rem' }} /> Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state-enhanced">
                    <IoMdDocument className="empty-icon" />
                    <h3>No Projects Yet</h3>
                    <p>Get started by creating your first project</p>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedProject(null);
                        setFormData({
                          title: '',
                          description: '',
                          category: 'social',
                          area_of_operation: '',
                          location: '',
                          target_beneficiaries: '',
                          status: 'upcoming',
                          project_manager_id: '',
                          images: []
                        });
                        setShowProjectForm(true);
                      }}
                    >
                      + Create First Project
                    </button>
                  </div>
                )}
              </div>

              <div className="team-management-sections">
                <div className="team-category-section">
                  <div className="section-subheader">
                    <h3>
                      <IoMdBriefcase className="section-icon" />
                      Project Managers <span className="count-badge">{projectManagers.length}</span>
                    </h3>
                  </div>
                  {projectManagers.length > 0 ? (
                    <div className="team-life-grid">
                      {projectManagers.map(pm => {
                        const pmProjects = projects.filter(p => p.project_manager_id === pm.id);
                        const pmSocialWorkers = socialWorkers.filter(sw => sw.project_manager_id === pm.id);
                        
                        return (
                          <div 
                            key={pm.id} 
                            className="team-life-card enhanced-team-card"
                            onClick={() => {
                              const normalizedId = pm.id_no.replace(/\s+/g, '').toUpperCase();
                              navigate(`/dashboard/project-manager/${encodeURIComponent(normalizedId)}`);
                            }}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <div className="team-card-header">
                              {pm.profile_picture ? (
                                <div className="team-life-image">
                                  <img src={pm.profile_picture} alt={pm.name} />
                                </div>
                              ) : (
                                <div className="team-life-image no-image">
                                  <span>{pm.name.charAt(0)}</span>
                                </div>
                              )}
                              <div className="team-header-info">
                                <h4>{pm.name}</h4>
                                <p className="team-life-id">{pm.id_no}</p>
                              </div>
                            </div>
                            
                            <div className="team-life-content">
                              <div className="team-life-details">
                              </div>
                              
                              <div className="team-life-stats">
                                <div className="stat-item enhanced-stat">
                                  <IoMdDocument className="stat-icon-small" />
                                  <div className="stat-content-small">
                                    <span className="stat-value">{pmProjects.length}</span>
                                    <span className="stat-label">Projects</span>
                                  </div>
                                </div>
                                <div className="stat-item enhanced-stat">
                                  <IoMdPeople className="stat-icon-small" />
                                  <div className="stat-content-small">
                                    <span className="stat-value">{pmSocialWorkers.length}</span>
                                    <span className="stat-label">Social Workers</span>
                                  </div>
                                </div>
                                <div className="stat-item enhanced-stat">
                                  <div className="stat-icon-small">🔄</div>
                                  <div className="stat-content-small">
                                    <span className="stat-value">{pmProjects.filter(p => p.status === 'ongoing').length}</span>
                                    <span className="stat-label">Active</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state-enhanced">
                      <IoMdBriefcase className="empty-icon" />
                      <h3>No Project Managers</h3>
                      <p>Contact administrator to assign Project Managers to your area</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {showProjectForm && (
          <div className="form-modal">
            <div className="form-modal-content">
              <div className="form-modal-header">
                <h3>{selectedProject ? 'Edit Project' : 'Create New Project'}</h3>
                <button className="close-btn" onClick={() => {
                  setShowProjectForm(false);
                  setSelectedProject(null);
                }}>×</button>
              </div>
              <form onSubmit={handleProjectSubmit} className="admin-form">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter project title"
                  />
                </div>

                <div className="form-group">
                  <label>Assign to Project Manager *</label>
                  {projectManagers.length > 0 ? (
                    <select
                      value={formData.project_manager_id}
                      onChange={(e) => setFormData({ ...formData, project_manager_id: e.target.value })}
                      required
                    >
                      <option value="">Select Project Manager</option>
                      {projectManagers.map(pm => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name} ({pm.id_no})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="error-text">
                      <p>No Project Managers assigned to you yet. Please contact the administrator to assign Project Managers to your area.</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="5"
                    required
                    placeholder="Enter project description"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="social">Social</option>
                    <option value="economy">Economy</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Area of Operation</label>
                  <input
                    type="text"
                    value={formData.area_of_operation}
                    onChange={(e) => setFormData({ ...formData, area_of_operation: e.target.value })}
                    placeholder="Enter area of operation"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter project location"
                  />
                </div>

                <div className="form-group">
                  <label>Target Beneficiaries</label>
                  <textarea
                    value={formData.target_beneficiaries}
                    onChange={(e) => setFormData({ ...formData, target_beneficiaries: e.target.value })}
                    rows="3"
                    placeholder="Describe target beneficiaries"
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Images</label>
                  {formData.images.length > 0 && (
                    <div className="images-grid">
                      {formData.images.map((img, index) => (
                        <div key={index} className="image-preview">
                          <img src={img} alt={`Image ${index + 1}`} />
                          <button type="button" onClick={() => removeImage(index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <p className="field-hint">You can select multiple images (up to 20 at once)</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : selectedProject ? 'Update Project' : 'Create & Assign Project'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowProjectForm(false);
                      setSelectedProject(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaManagerDashboard;

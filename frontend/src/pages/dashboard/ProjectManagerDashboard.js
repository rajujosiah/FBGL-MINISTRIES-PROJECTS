import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getProjectManagers,
  getSocialWorkers,
  getProjects,
  updateProject,
  initializeData
} from '../../utils/dataManager';
import ProfileModal from '../../components/ProfileModal';
import { IoMdPerson, IoMdPeople, IoMdDocument, IoMdCheckmarkCircle, IoMdMap, IoMdCreate, IoMdCube } from 'react-icons/io';
import './Dashboard.css';
import '../../components/admin/AdminComponents.css';

const ProjectManagerDashboard = () => {
  const { user } = useAuth();
  const [projectManager, setProjectManager] = useState(null);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSocialWorkerId, setSelectedSocialWorkerId] = useState('');
  const [showProfile, setShowProfile] = useState(false);

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

      // Get all project managers (now async)
      const allPMs = await getProjectManagers();

      if (allPMs.length === 0) {
        console.error('No project managers found');
        setLoading(false);
        return;
      }

      // Try multiple matching strategies
      let foundPM = null;

      // Strategy 1: Match by username (could be ID no or email)
      foundPM = allPMs.find(pm => 
        (pm.id_no && pm.id_no.replace(/\s+/g, '').toUpperCase() === user.username.toUpperCase()) ||
        (pm.email && pm.email.toLowerCase() === user.username.toLowerCase()) ||
        (pm.id && pm.id.toString() === user.username)
      );

      // Strategy 2: If using generic 'projectmanager' login, use first available PM
      if (!foundPM && (user.username === 'projectmanager' || user.username === 'project_manager') && allPMs.length > 0) {
        foundPM = allPMs[0]; // Use first project manager for demo
      }

      // Strategy 3: Match by role and use first project manager
      if (!foundPM && user.role === 'project_manager' && allPMs.length > 0) {
        foundPM = allPMs[0]; // Use first project manager as fallback
      }

      if (foundPM) {
        setProjectManager(foundPM);

        // Load assigned Social Workers (now async)
        const assignedSWs = await getSocialWorkers(foundPM.id);
        setSocialWorkers(assignedSWs || []);

        // Load projects assigned to this Project Manager (now async)
        const pmProjects = await getProjects({ projectManagerId: foundPM.id });
        setProjects(pmProjects || []);
      } else {
        console.error('Project Manager not found for user:', user);
      }
    } catch (error) {
      console.error('Error loading project manager data:', error);
      alert('Error loading dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProject = (project) => {
    setSelectedProject(project);
    setSelectedSocialWorkerId(project.social_worker_id || '');
    setShowAssignmentModal(true);
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();

    if (!selectedProject || !selectedSocialWorkerId) {
      alert('Please select a Social Worker to assign the project.');
      return;
    }

    try {
      updateProject(selectedProject.id, {
        social_worker_id: parseInt(selectedSocialWorkerId)
      });

      alert('Project assigned successfully!');
      setShowAssignmentModal(false);
      setSelectedProject(null);
      setSelectedSocialWorkerId('');
      loadData(); // Reload data to refresh the UI
    } catch (error) {
      console.error('Error assigning project:', error);
      alert('Error assigning project. Please try again.');
    }
  };

  const handleUnassignProject = (project) => {
    if (window.confirm(`Are you sure you want to unassign "${project.title}" from the Social Worker?`)) {
      try {
        updateProject(project.id, {
          social_worker_id: null
        });

        alert('Project unassigned successfully!');
        loadData(); // Reload data to refresh the UI
      } catch (error) {
        console.error('Error unassigning project:', error);
        alert('Error unassigning project. Please try again.');
      }
    }
  };

  // Get available projects (assigned to PM but not yet assigned to Social Workers)
  const availableProjects = projects.filter(p => !p.social_worker_id);
  
  // Get assigned projects (assigned to Social Workers)
  const assignedProjects = projects.filter(p => p.social_worker_id);

  const stats = {
    totalProjects: projects.length,
    availableProjects: availableProjects.length,
    assignedProjects: assignedProjects.length,
    activeProjects: projects.filter(p => p.status === 'ongoing' || p.status === 'Ongoing').length,
    completedProjects: projects.filter(p => p.status === 'completed' || p.status === 'Completed').length,
    upcomingProjects: projects.filter(p => p.status === 'upcoming' || p.status === 'Upcoming').length,
    socialWorkers: socialWorkers.length
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

  if (!projectManager) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-message">
            <h2>Access Denied</h2>
            <p>Project Manager profile not found. Please contact the administrator.</p>
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
            <h1>Project Manager Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{projectManager.name}</strong>!</p>
            <p className="location-info">{projectManager.state} - {projectManager.district}</p>
          </div>
          <div className="dashboard-info">
            <span className="role-badge role-project-manager">Project Manager</span>
            <span className="user-info">{projectManager.id_no}</span>
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

        {showProfile && projectManager && (
          <ProfileModal
            user={projectManager}
            role="project_manager"
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
            className={activeTab === 'projects' ? 'tab-active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Available Projects ({stats.availableProjects})
          </button>
          <button 
            className={activeTab === 'assigned' ? 'tab-active' : ''}
            onClick={() => setActiveTab('assigned')}
          >
            Assigned Projects ({stats.assignedProjects})
          </button>
          <button 
            className={activeTab === 'social-workers' ? 'tab-active' : ''}
            onClick={() => setActiveTab('social-workers')}
          >
            Social Workers ({stats.socialWorkers})
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Dashboard Overview</h2>
                <p className="section-description">
                  Complete overview of your projects and team members.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdPeople className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Social Workers</h3>
                    <p className="stat-number">{stats.socialWorkers}</p>
                    <p className="stat-description">Team members</p>
                  </div>
                </div>

                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdDocument className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Total Projects</h3>
                    <p className="stat-number">{stats.totalProjects}</p>
                    <p className="stat-description">All assigned projects</p>
                  </div>
                </div>

                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdCube className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Available</h3>
                    <p className="stat-number">{stats.availableProjects}</p>
                    <p className="stat-description">Unassigned projects</p>
                  </div>
                </div>

                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdCheckmarkCircle className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Assigned</h3>
                    <p className="stat-number">{stats.assignedProjects}</p>
                    <p className="stat-description">Projects with workers</p>
                  </div>
                </div>

                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">🔄</div>
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
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Available Projects</h2>
                <p className="section-description">
                  Projects assigned to you that need to be assigned to Social Workers.
                </p>
              </div>

              {availableProjects.length > 0 ? (
                <div className="projects-list">
                  {availableProjects.map(project => (
                    <div key={project.id} className="enhanced-project-card">
                      <div className="project-card-header">
                        <div className="project-title-section">
                          <h3>{project.title}</h3>
                          <span className={`category-tag category-tag-${project.category}`}>
                            {project.category || 'N/A'}
                          </span>
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
                          </div>
                        )}
                      </div>

                      <div className="project-card-footer">
                        <button 
                          className="btn-small btn-primary"
                          onClick={() => handleAssignProject(project)}
                        >
                          📤 Assign to Social Worker
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-enhanced">
                  <IoMdDocument className="empty-icon" />
                  <h3>No Available Projects</h3>
                  <p>All projects have been assigned to Social Workers.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Assigned Projects</h2>
                <p className="section-description">
                  Projects that have been assigned to Social Workers.
                </p>
              </div>

              {assignedProjects.length > 0 ? (
                <div className="projects-list">
                  {assignedProjects.map(project => {
                    const assignedSW = socialWorkers.find(sw => sw.id === project.social_worker_id);
                    
                    return (
                      <div key={project.id} className="enhanced-project-card">
                        <div className="project-card-header">
                          <div className="project-title-section">
                            <h3>{project.title}</h3>
                            <span className={`category-tag category-tag-${project.category}`}>
                              {project.category || 'N/A'}
                            </span>
                          </div>
                          <span className={`status-badge status-${(project.status || 'upcoming').toLowerCase()}`}>
                            {project.status || 'Upcoming'}
                          </span>
                        </div>

                        <div className="project-card-body">
                          <p className="project-card-description">{project.description}</p>
                          
                          <div className="project-card-details-grid">
                            <div className="detail-item">
                              <IoMdPerson className="detail-icon" />
                              <div className="detail-content">
                                <span className="detail-label">Assigned To</span>
                                <span className="detail-value">{assignedSW?.name || 'Unknown'}</span>
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
                          </div>
                        </div>

                        <div className="project-card-footer">
                          <button 
                            className="btn-small btn-secondary"
                            onClick={() => handleUnassignProject(project)}
                          >
                            🔄 Unassign
                          </button>
                          <button 
                            className="btn-small btn-primary"
                            onClick={() => handleAssignProject(project)}
                          >
                            <IoMdCreate style={{ marginRight: '0.5rem' }} /> Reassign
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-enhanced">
                  <IoMdDocument className="empty-icon" />
                  <h3>No Assigned Projects</h3>
                  <p>No projects have been assigned to Social Workers yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social-workers' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Assigned Social Workers</h2>
                <p className="section-description">
                  View all Social Workers assigned to you.
                </p>
              </div>

              {socialWorkers.length > 0 ? (
                <div className="team-life-grid">
                  {socialWorkers.map(sw => {
                    const swProjects = projects.filter(p => p.social_worker_id === sw.id);
                    
                    return (
                      <div key={sw.id} className="team-life-card enhanced-team-card">
                        <div className="team-card-header">
                          {sw.profile_picture ? (
                            <div className="team-life-image">
                              <img src={sw.profile_picture} alt={sw.name} />
                            </div>
                          ) : (
                            <div className="team-life-image no-image">
                              <span>{sw.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="team-header-info">
                            <h4>{sw.name}</h4>
                            <p className="team-life-id">{sw.id_no}</p>
                          </div>
                        </div>
                        
                        <div className="team-life-content">
                          <div className="team-life-stats">
                            <div className="stat-item enhanced-stat">
                              <IoMdDocument className="stat-icon-small" />
                              <div className="stat-content-small">
                                <span className="stat-value">{swProjects.length}</span>
                                <span className="stat-label">Projects</span>
                              </div>
                            </div>
                            <div className="stat-item enhanced-stat">
                              <div className="stat-icon-small">🔄</div>
                              <div className="stat-content-small">
                                <span className="stat-value">{swProjects.filter(p => p.status === 'ongoing' || p.status === 'Ongoing').length}</span>
                                <span className="stat-label">Active</span>
                              </div>
                            </div>
                            <div className="stat-item enhanced-stat">
                              <IoMdCheckmarkCircle className="stat-icon-small" />
                              <div className="stat-content-small">
                                <span className="stat-value">{swProjects.filter(p => p.status === 'completed' || p.status === 'Completed').length}</span>
                                <span className="stat-label">Completed</span>
                              </div>
                            </div>
                          </div>

                          {/* Show Projects for this Social Worker */}
                          {swProjects.length > 0 && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e0e0e0' }}>
                              <h4 style={{ fontSize: '0.9rem', color: '#1e3c72', marginBottom: '0.5rem' }}>Projects:</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {swProjects.slice(0, 3).map(project => (
                                  <div key={project.id} style={{ 
                                    padding: '0.5rem', 
                                    background: '#f5f7fa', 
                                    borderRadius: '6px',
                                    fontSize: '0.85rem'
                                  }}>
                                    <strong>{project.title}</strong>
                                    <span className={`status-badge status-${(project.status || 'upcoming').toLowerCase()}`} style={{ 
                                      marginLeft: '0.5rem',
                                      padding: '0.2rem 0.5rem',
                                      fontSize: '0.75rem'
                                    }}>
                                      {project.status || 'Upcoming'}
                                    </span>
                                  </div>
                                ))}
                                {swProjects.length > 3 && (
                                  <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                                    +{swProjects.length - 3} more projects
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-enhanced">
                  <IoMdPeople className="empty-icon" />
                  <h3>No Social Workers Assigned</h3>
                  <p>No Social Workers have been assigned to you yet. Contact the administrator.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedProject && (
          <div className="form-modal">
            <div className="form-modal-content">
              <div className="form-modal-header">
                <h3>Assign Project to Social Worker</h3>
                <button className="close-btn" onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedProject(null);
                  setSelectedSocialWorkerId('');
                }}>×</button>
              </div>
              <form onSubmit={handleSubmitAssignment} className="admin-form">
                <div className="form-group">
                  <label>Project</label>
                  <input
                    type="text"
                    value={selectedProject.title}
                    disabled
                    style={{ background: '#f5f7fa', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label>Assign to Social Worker *</label>
                  {socialWorkers.length > 0 ? (
                    <select
                      value={selectedSocialWorkerId}
                      onChange={(e) => setSelectedSocialWorkerId(e.target.value)}
                      required
                    >
                      <option value="">Select Social Worker</option>
                      {socialWorkers.map(sw => (
                        <option key={sw.id} value={sw.id}>
                          {sw.name} ({sw.id_no})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="error-text">
                      <p>No Social Workers assigned to you yet. Please contact the administrator.</p>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={!selectedSocialWorkerId}>
                    Assign Project
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowAssignmentModal(false);
                      setSelectedProject(null);
                      setSelectedSocialWorkerId('');
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

export default ProjectManagerDashboard;

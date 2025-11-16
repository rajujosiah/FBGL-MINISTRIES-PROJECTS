import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getProjectManagers, 
  getSocialWorkers, 
  getProjects, 
  getAreaManagers,
  initializeData 
} from '../../utils/dataManager';
import IDCard from '../../components/IDCard';
import { IoMdDocument, IoMdCheckmarkCircle, IoMdPeople, IoMdPerson, IoMdMap, IoMdImages } from 'react-icons/io';
import './Dashboard.css';
import '../../components/admin/AdminComponents.css';

const ProjectManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectManager, setProjectManager] = useState(null);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [areaManager, setAreaManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSocialWorker, setSelectedSocialWorker] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initializeData();
    loadData();
  }, [id]);

  const loadData = () => {
    try {
      const decodedId = decodeURIComponent(id);
      const normalizedUrlId = normalizeIdNo(decodedId);
      const allPMs = getProjectManagers();
      
      // Try to find by ID number first (primary method)
      let pm = allPMs.find(p => normalizeIdNo(p.id_no) === normalizedUrlId);
      
      // Fallback: try numeric ID if ID number doesn't match
      if (!pm) {
        const pmId = parseInt(decodedId);
        if (!isNaN(pmId)) {
          pm = allPMs.find(p => p.id === pmId);
        }
      }
      
      if (!pm) {
        console.error('Project Manager not found for ID:', decodedId);
        navigate('/dashboard/area-manager');
        return;
      }

      setProjectManager(pm);

      // Load Area Manager
      if (pm.area_manager_id) {
        const allAMs = getAreaManagers();
        const am = allAMs.find(a => a.id === pm.area_manager_id);
        setAreaManager(am);
      }

      // Load assigned Social Workers
      const allSWs = getSocialWorkers();
      const assignedSWs = allSWs.filter(sw => sw.project_manager_id === pm.id);
      setSocialWorkers(assignedSWs);

      // Load projects assigned to this Project Manager
      const allProjects = getProjects({});
      const pmProjects = allProjects.filter(p => p.project_manager_id === pm.id);
      setProjects(pmProjects);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      // Ensure scroll to top after data loads
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const normalizeIdNo = (idNo) => {
    if (!idNo) return '';
    return idNo.replace(/\s+/g, '').toUpperCase();
  };

  const stats = {
    totalProjects: projects.length,
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
            <h2>Loading...</h2>
            <p>Please wait while we load the Project Manager details.</p>
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
            <h2>Project Manager Not Found</h2>
            <p>The requested Project Manager could not be found.</p>
            <button className="btn-primary" onClick={() => navigate('/dashboard/area-manager')}>
              Back to Dashboard
            </button>
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
            <button 
              className="btn-secondary"
              onClick={() => navigate('/dashboard/area-manager')}
              style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
            >
              ← Back to Dashboard
            </button>
            <h1>Project Manager Details</h1>
            <p className="welcome-text">
              <strong>{projectManager.name}</strong> - {projectManager.id_no}
            </p>
          </div>
          <div className="dashboard-info">
            <span className="role-badge role-project-manager">Project Manager</span>
            <span className="user-info">{projectManager.state} - {projectManager.district}</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div className="team-life-card enhanced-team-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="team-card-header">
              {projectManager.profile_picture ? (
                <div className="team-life-image">
                  <img src={projectManager.profile_picture} alt={projectManager.name} />
                </div>
              ) : (
                <div className="team-life-image no-image">
                  <span>{projectManager.name.charAt(0)}</span>
                </div>
              )}
              <div className="team-header-info">
                <h4>{projectManager.name}</h4>
                <p className="team-life-id">{projectManager.id_no}</p>
                {areaManager && (
                  <p className="location-info">Reports To: {areaManager.name}</p>
                )}
              </div>
            </div>
            <div className="team-life-content">
              <div className="team-life-stats">
                <div className="stat-item enhanced-stat">
                  <IoMdDocument className="stat-icon-small" />
                  <div className="stat-content-small">
                    <span className="stat-value">{stats.totalProjects}</span>
                    <span className="stat-label">Total Projects</span>
                  </div>
                </div>
                <div className="stat-item enhanced-stat">
                  <IoMdPeople className="stat-icon-small" />
                  <div className="stat-content-small">
                    <span className="stat-value">{stats.socialWorkers}</span>
                    <span className="stat-label">Social Workers</span>
                  </div>
                </div>
                                <div className="stat-item enhanced-stat">
                                  <div className="stat-icon-small">🔄</div>
                                  <div className="stat-content-small">
                                    <span className="stat-value">{stats.activeProjects}</span>
                                    <span className="stat-label">Active</span>
                                  </div>
                                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab-active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview ({stats.totalProjects})
          </button>
          <button 
            className={activeTab === 'social-workers' ? 'tab-active' : ''}
            onClick={() => setActiveTab('social-workers')}
          >
            Social Workers ({stats.socialWorkers})
          </button>
          <button 
            className={activeTab === 'projects' ? 'tab-active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects ({stats.totalProjects})
          </button>
        </div>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Project Manager Overview</h2>
                <p className="section-description">
                  Complete overview of projects, team members, and performance metrics.
                </p>
              </div>

              <div className="stats-grid">
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
                    <div className="stat-icon">🔄</div>
                  </div>
                  <div className="stat-content">
                    <h3>Active Projects</h3>
                    <p className="stat-number">{stats.activeProjects}</p>
                    <p className="stat-description">Currently in progress</p>
                  </div>
                </div>

                <div className="stat-card enhanced-stat-card">
                  <div className="stat-icon-wrapper">
                    <IoMdCheckmarkCircle className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h3>Completed</h3>
                    <p className="stat-number">{stats.completedProjects}</p>
                    <p className="stat-description">Successfully finished</p>
                  </div>
                </div>

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
              </div>

            </div>
          )}

          {/* Social Workers Tab */}
          {activeTab === 'social-workers' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Assigned Social Workers</h2>
                <p className="section-description">
                  View all Social Workers assigned to this Project Manager and their project reports.
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
                  <p>No Social Workers have been assigned to this Project Manager yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>All Projects</h2>
                <p className="section-description">
                  Complete list of all projects assigned to this Project Manager.
                </p>
              </div>

              {projects.length > 0 ? (
                <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {projects.map(project => {
                    const assignedSW = socialWorkers.find(sw => sw.id === project.social_worker_id);
                    
                    return (
                      <div key={project.id} className="enhanced-project-card">
                        <div className="project-title-section">
                          <h3>{project.title}</h3>
                          <span className={`category-tag category-tag-${project.category}`}>
                            {project.category || 'N/A'}
                          </span>
                        </div>
                        <div className="project-card-body">
                          <p className="project-card-description">{project.description}</p>
                          <div className="project-card-details-grid">
                            <div className="detail-item">
                              <IoMdPerson className="detail-icon" />
                              <div className="detail-content">
                                <span className="detail-label">Assigned To</span>
                                <span className="detail-value">{assignedSW?.name || 'Unassigned'}</span>
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
                          <span className={`status-badge status-${(project.status || 'upcoming').toLowerCase()}`}>
                            {project.status || 'Upcoming'}
                          </span>
                          {project.images && project.images.length > 0 && (
                            <span className="project-meta">
                              <IoMdImages className="meta-icon" />
                              {project.images.length} photos
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-enhanced">
                  <IoMdDocument className="empty-icon" />
                  <h3>No Projects Assigned</h3>
                  <p>No projects have been assigned to this Project Manager yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDetail;


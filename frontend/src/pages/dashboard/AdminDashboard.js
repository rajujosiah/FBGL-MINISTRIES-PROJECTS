import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAreaManagers,
  getProjectManagers,
  getSocialWorkers,
  getProjects,
  getBlogPosts,
  initializeData,
  toggleProjectHomeStatus,
  addProject
} from '../../utils/dataManager';
import ManageAdmins from '../../components/admin/ManageAdmins';
import ManageAreaManagers from '../../components/admin/ManageAreaManagers';
import ManageProjectManagers from '../../components/admin/ManageProjectManagers';
import ManageSocialWorkers from '../../components/admin/ManageSocialWorkers';
import ManageAssignments from '../../components/admin/ManageAssignments';
import ManageBoardMembers from '../../components/admin/ManageBoardMembers';
import BlogManagement from '../../components/admin/BlogManagement';
import ProfileModal from '../../components/ProfileModal';
import ConnectionError from '../../components/ConnectionError';
import { ConnectionError as DataConnectionError, getAdmins } from '../../utils/dataManager';
import { IoMdPerson, IoMdBriefcase, IoMdPeople, IoMdDocument, IoMdCreate, IoMdKey, IoMdHome, IoMdCheckmark, IoMdAdd, IoMdClose } from 'react-icons/io';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    admins: 0,
    areaManagers: 0,
    projectManagers: 0,
    socialWorkers: 0,
    projects: 0,
    blogPosts: 0
  });
  const [connectionError, setConnectionError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'social',
    status: 'upcoming',
    location: '',
    area_of_operation: '',
    target_beneficiaries: '',
    project_manager_id: '',
    social_worker_id: '',
    images: []
  });

  useEffect(() => {
    initializeData();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setConnectionError(null);
      const [adminsData, areas, projects, workers, projs, posts] = await Promise.all([
        getAdmins(),
        getAreaManagers(),
        getProjectManagers(),
        getSocialWorkers(),
        getProjects({}),
        getBlogPosts()
      ]);

      setStats({
        admins: adminsData.length,
        areaManagers: areas.length,
        projectManagers: projects.length,
        socialWorkers: workers.length,
        projects: projs.length,
        blogPosts: posts.length
      });
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to load dashboard data. Please check your internet connection.');
      }
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const allProjects = await getProjects({});
      setProjects(allProjects);

      // Load project managers and social workers for the form
      const pms = await getProjectManagers();
      const sws = await getSocialWorkers();
      setProjectManagers(pms);
      setSocialWorkers(sws);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleToggleHomeStatus = async (projectId, currentStatus) => {
    try {
      await toggleProjectHomeStatus(projectId, !currentStatus);
      // Reload projects to reflect the change
      await loadProjects();
    } catch (error) {
      alert('Failed to update project: ' + error.message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await addProject(newProject);
      alert('Project created successfully!');
      setShowProjectForm(false);
      setNewProject({
        title: '',
        description: '',
        category: 'social',
        status: 'upcoming',
        location: '',
        area_of_operation: '',
        target_beneficiaries: '',
        project_manager_id: '',
        social_worker_id: '',
        images: []
      });
      await loadProjects();
      await loadStats();
    } catch (error) {
      alert('Failed to create project: ' + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setNewProject(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Admin Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{user?.name || 'Admin'}</strong>!</p>
          </div>
          <div className="dashboard-info">
            <span className="role-badge role-admin">Admin</span>
            <span className="user-info">{user?.username}</span>
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

        {showProfile && user && (
          <ProfileModal
            user={user}
            role="admin"
            onClose={() => setShowProfile(false)}
            onUpdate={() => {
              setShowProfile(false);
            }}
          />
        )}

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'admins' ? 'active' : ''}
            onClick={() => setActiveTab('admins')}
          >
            Admins
          </button>
          <button
            className={activeTab === 'area-managers' ? 'active' : ''}
            onClick={() => setActiveTab('area-managers')}
          >
            Area Managers
          </button>
          <button
            className={activeTab === 'project-managers' ? 'active' : ''}
            onClick={() => setActiveTab('project-managers')}
          >
            Project Managers
          </button>
          <button
            className={activeTab === 'social-workers' ? 'active' : ''}
            onClick={() => setActiveTab('social-workers')}
          >
            Social Workers
          </button>
          <button
            className={activeTab === 'assignments' ? 'active' : ''}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={activeTab === 'blog' ? 'active' : ''}
            onClick={() => setActiveTab('blog')}
          >
            Blog Management
          </button>
          <button
            className={activeTab === 'board-members' ? 'active' : ''}
            onClick={() => setActiveTab('board-members')}
          >
            Board Members
          </button>
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => { setActiveTab('projects'); loadProjects(); }}
          >
            Projects
          </button>
        </div>

        <div className="dashboard-content">
          {connectionError && (
            <ConnectionError
              message={connectionError}
              onRetry={loadStats}
            />
          )}

          {activeTab === 'overview' && (
            <>
              <div className="dashboard-section">
                <h2>Dashboard Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <IoMdKey className="stat-icon" />
                    <div className="stat-content">
                      <h3>Admins</h3>
                      <p className="stat-number">{stats.admins}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-content">
                      <h3>Area Managers</h3>
                      <p className="stat-number">{stats.areaManagers}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <IoMdBriefcase className="stat-icon" />
                    <div className="stat-content">
                      <h3>Project Managers</h3>
                      <p className="stat-number">{stats.projectManagers}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <IoMdPeople className="stat-icon" />
                    <div className="stat-content">
                      <h3>Social Workers</h3>
                      <p className="stat-number">{stats.socialWorkers}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <IoMdDocument className="stat-icon" />
                    <div className="stat-content">
                      <h3>Total Projects</h3>
                      <p className="stat-number">{stats.projects}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <IoMdCreate className="stat-icon" />
                    <div className="stat-content">
                      <h3>Blog Posts</h3>
                      <p className="stat-number">{stats.blogPosts}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <div className="action-card" onClick={() => setActiveTab('admins')}>
                    <h3>Manage Admins</h3>
                    <p>Create and manage Admin users</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('area-managers')}>
                    <h3>Manage Area Managers</h3>
                    <p>Create and manage Area Managers</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('project-managers')}>
                    <h3>Manage Project Managers</h3>
                    <p>Create and manage Project Managers</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('social-workers')}>
                    <h3>Manage Social Workers</h3>
                    <p>Create and manage Social Workers</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('assignments')}>
                    <h3>Manage Assignments</h3>
                    <p>Assign team members to their managers</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('blog')}>
                    <h3>Manage Blog</h3>
                    <p>Create and edit blog posts</p>
                  </div>
                  <div className="action-card" onClick={() => setActiveTab('board-members')}>
                    <h3>Manage Board</h3>
                    <p>Add and edit board members</p>
                  </div>
                  <div className="action-card" onClick={() => { setActiveTab('projects'); loadProjects(); }}>
                    <h3>Manage Projects</h3>
                    <p>Select projects to show on home page</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'admins' && (
            <div className="dashboard-section">
              <ManageAdmins onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'area-managers' && (
            <div className="dashboard-section">
              <ManageAreaManagers onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'project-managers' && (
            <div className="dashboard-section">
              <ManageProjectManagers onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'social-workers' && (
            <div className="dashboard-section">
              <ManageSocialWorkers onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="dashboard-section">
              <ManageAssignments onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="dashboard-section">
              <BlogManagement onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'board-members' && (
            <div className="dashboard-section">
              <ManageBoardMembers onUpdate={loadStats} />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h2>Manage Home Page Projects</h2>
                  <p className="section-description">
                    Select which projects should be displayed on the home page.
                  </p>
                </div>
              </div>

              <div className="manage-section">
                {loadingProjects ? (
                  <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                  <p className="info-text">No projects found. Create projects first to display them on the home page.</p>
                ) : (
                  <div className="projects-list">
                    {projects.map(project => (
                      <div key={project.id} className="project-item" style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: project.show_on_home ? '#f0f9ff' : '#fff'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>{project.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                            Category: {project.category} | Status: {project.status}
                          </p>
                        </div>
                        <button
                          className={project.show_on_home ? 'btn-success' : 'btn-secondary'}
                          onClick={() => handleToggleHomeStatus(project.id, project.show_on_home)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '150px',
                            justifyContent: 'center'
                          }}
                        >
                          {project.show_on_home ? (
                            <>
                              <IoMdCheckmark /> Showing on Home
                            </>
                          ) : (
                            <>
                              <IoMdHome /> Show on Home
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;


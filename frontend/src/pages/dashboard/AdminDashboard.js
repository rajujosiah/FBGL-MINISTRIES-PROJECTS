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
  addProject,
  getAdmins
} from '../../utils/dataManager';
import { compressImage } from '../../utils/imageUtils';
import ManageAdmins from '../../components/admin/ManageAdmins';
import ManageAreaManagers from '../../components/admin/ManageAreaManagers';
import ManageProjectManagers from '../../components/admin/ManageProjectManagers';
import ManageSocialWorkers from '../../components/admin/ManageSocialWorkers';
import ManageAssignments from '../../components/admin/ManageAssignments';
import ManageBoardMembers from '../../components/admin/ManageBoardMembers';
import BlogManagement from '../../components/admin/BlogManagement';
import Reports from '../../components/admin/Reports';
import ProfileModal from '../../components/ProfileModal';
import ConnectionError from '../../components/ConnectionError';
import { ConnectionError as DataConnectionError } from '../../utils/dataManager';
import { IoMdPerson, IoMdBriefcase, IoMdPeople, IoMdDocument, IoMdCreate, IoMdKey, IoMdHome, IoMdCheckmark, IoMdAdd, IoMdClose, IoMdDownload } from 'react-icons/io';
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
  const [areaManagers, setAreaManagers] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'social',
    status: 'upcoming',
    location: '',
    area_of_operation: '',
    target_beneficiaries: '',
    area_manager_id: '',
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

      // Load managers and workers for the form
      const [ams, pms, sws] = await Promise.all([
        getAreaManagers(),
        getProjectManagers(),
        getSocialWorkers()
      ]);
      setAreaManagers(ams);
      setProjectManagers(pms);
      setSocialWorkers(sws);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const [showAllOnHome, setShowAllOnHome] = useState(false);

  useEffect(() => {
    initializeData();
    loadStats();
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const { getSiteSettings } = require('../../utils/dataManager');
      const settings = await getSiteSettings();
      setShowAllOnHome(settings.show_all_projects_on_home);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const handleToggleGlobalHome = async () => {
    try {
      const { updateSiteSettings } = require('../../utils/dataManager');
      const newStatus = !showAllOnHome;
      await updateSiteSettings({ show_all_projects_on_home: newStatus });
      setShowAllOnHome(newStatus);
      // Reload projects if we're on the projects tab
      if (activeTab === 'projects') {
        await loadProjects();
      }
    } catch (error) {
      alert('Failed to update settings: ' + error.message);
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
        area_manager_id: '',
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const compressedImages = await Promise.all(
        files.map(file => compressImage(file))
      );

      setNewProject(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));
    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Failed to process images. Please try again.');
    }
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
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={activeTab === 'assignments' ? 'active' : ''}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={activeTab === 'board-members' ? 'active' : ''}
            onClick={() => setActiveTab('board-members')}
          >
            Board Members
          </button>
          <button
            className={activeTab === 'blog' ? 'active' : ''}
            onClick={() => setActiveTab('blog')}
          >
            Blog Posts
          </button>
          <button
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            Reports
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
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon admin-icon"><IoMdKey /></div>
                  <div className="stat-info">
                    <h3>{stats.admins}</h3>
                    <p>Admins</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon area-icon"><IoMdPerson /></div>
                  <div className="stat-info">
                    <h3>{stats.areaManagers}</h3>
                    <p>Area Managers</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon project-icon"><IoMdBriefcase /></div>
                  <div className="stat-info">
                    <h3>{stats.projectManagers}</h3>
                    <p>Project Managers</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon worker-icon"><IoMdPeople /></div>
                  <div className="stat-info">
                    <h3>{stats.socialWorkers}</h3>
                    <p>Social Workers</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon project-count-icon"><IoMdDocument /></div>
                  <div className="stat-info">
                    <h3>{stats.projects}</h3>
                    <p>Projects</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blog-icon"><IoMdCreate /></div>
                  <div className="stat-info">
                    <h3>{stats.blogPosts}</h3>
                    <p>Blog Posts</p>
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-section">
              <div className="section-header">
                <h2>Manage Projects</h2>
                <div className="project-actions">
                  <div className="global-toggle-container">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={showAllOnHome}
                        onChange={handleToggleGlobalHome}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="toggle-label">
                      {showAllOnHome ? 'Showing ALL Projects on Home' : 'Show Selected Projects Only'}
                    </span>
                  </div>
                  <button className="btn-primary" onClick={() => {
                    loadProjects();
                    setShowProjectForm(true);
                  }}>
                    <IoMdAdd /> Create Project
                  </button>
                </div>
              </div>

              {loadingProjects ? (
                <p>Loading projects...</p>
              ) : (
                <div className="projects-list">
                  {projects.length === 0 ? (
                    <p>No projects found.</p>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Home Page</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map(project => (
                            <tr key={project.id}>
                              <td>{project.title}</td>
                              <td>
                                <span className={`category-badge ${project.category.toLowerCase()}`}>
                                  {project.category}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge ${project.status}`}>
                                  {project.status}
                                </span>
                              </td>
                              <td>{project.location || '-'}</td>
                              <td>
                                <button
                                  className={`btn-icon ${project.show_on_home ? 'active' : ''}`}
                                  onClick={() => handleToggleHomeStatus(project.id, project.show_on_home)}
                                  title={project.show_on_home ? "Remove from Home" : "Show on Home"}
                                >
                                  {project.show_on_home ? (
                                    <>
                                      <IoMdCheckmark /> On Home
                                    </>
                                  ) : (
                                    <>
                                      <IoMdHome /> Show on Home
                                    </>
                                  )}
                                </button>
                              </td>
                              <td>
                                <button className="btn-small btn-secondary">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admins' && <ManageAdmins />}
          {activeTab === 'area-managers' && <ManageAreaManagers />}
          {activeTab === 'project-managers' && <ManageProjectManagers />}
          {activeTab === 'social-workers' && <ManageSocialWorkers />}
          {activeTab === 'assignments' && <ManageAssignments />}
          {activeTab === 'board-members' && <ManageBoardMembers />}
          {activeTab === 'blog' && <BlogManagement onUpdate={loadStats} />}
          {activeTab === 'reports' && <Reports />}
        </div>

        {/* Create Project Modal */}
        {showProjectForm && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <h3>Create New Project</h3>
                <button className="close-button" onClick={() => setShowProjectForm(false)}>
                  <IoMdClose />
                </button>
              </div>
              <form onSubmit={handleCreateProject} style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      required
                    >
                      <option value="social">Social</option>
                      <option value="economic">Economic</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                      required
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Area of Operation</label>
                  <input
                    type="text"
                    value={newProject.area_of_operation}
                    onChange={(e) => setNewProject({ ...newProject, area_of_operation: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Target Beneficiaries</label>
                  <input
                    type="text"
                    value={newProject.target_beneficiaries}
                    onChange={(e) => setNewProject({ ...newProject, target_beneficiaries: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Area Manager</label>
                    <select
                      value={newProject.area_manager_id}
                      onChange={(e) => setNewProject({ ...newProject, area_manager_id: e.target.value })}
                    >
                      <option value="">Select Area Manager</option>
                      {areaManagers.map(am => (
                        <option key={am.id} value={am.id}>{am.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Project Manager</label>
                    <select
                      value={newProject.project_manager_id}
                      onChange={(e) => setNewProject({ ...newProject, project_manager_id: e.target.value })}
                    >
                      <option value="">Select Project Manager</option>
                      {projectManagers.map(pm => (
                        <option key={pm.id} value={pm.id}>{pm.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Social Worker</label>
                    <select
                      value={newProject.social_worker_id}
                      onChange={(e) => setNewProject({ ...newProject, social_worker_id: e.target.value })}
                    >
                      <option value="">Select Social Worker</option>
                      {socialWorkers.map(sw => (
                        <option key={sw.id} value={sw.id}>{sw.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="image-previews" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {newProject.images.map((img, index) => (
                      <img key={index} src={img} alt={`Preview ${index}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowProjectForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Project
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

export default AdminDashboard;

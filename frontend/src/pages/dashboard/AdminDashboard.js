import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAreaManagers, 
  getProjectManagers, 
  getSocialWorkers, 
  getProjects,
  getBlogPosts,
  initializeData
} from '../../utils/dataManager';
import ManageAreaManagers from '../../components/admin/ManageAreaManagers';
import ManageProjectManagers from '../../components/admin/ManageProjectManagers';
import ManageSocialWorkers from '../../components/admin/ManageSocialWorkers';
import ManageAssignments from '../../components/admin/ManageAssignments';
import BlogManagement from '../../components/admin/BlogManagement';
import ProfileModal from '../../components/ProfileModal';
import ConnectionError from '../../components/ConnectionError';
import { ConnectionError as DataConnectionError } from '../../utils/dataManager';
import { IoMdPerson, IoMdBriefcase, IoMdPeople, IoMdDocument, IoMdCreate } from 'react-icons/io';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    areaManagers: 0,
    projectManagers: 0,
    socialWorkers: 0,
    projects: 0,
    blogPosts: 0
  });
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    initializeData();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setConnectionError(null);
      const [areas, projects, workers, projs, posts] = await Promise.all([
        getAreaManagers(),
        getProjectManagers(),
        getSocialWorkers(),
        getProjects({}),
        getBlogPosts()
      ]);
      
      setStats({
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
                </div>
              </div>
            </>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, ROLES } from '../../services/supabaseClient';
import { User, Users, FolderOpen, Plus, Edit, Eye, Calendar } from 'lucide-react';
import '../../styles/pages/dashboard.css';

const ManagerDashboard = () => {
  const { profile } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    teamMembers: [],
    projects: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch team members under this manager
      const { data: teamMembers } = await supabase
        .from('profiles')
        .select('*')
        .eq('assigned_to', profile.id)
        .order('created_at', { ascending: false });

      // Fetch projects assigned to this manager or their team
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .or(`assigned_to.eq.${profile.id},assigned_to.in.(${teamMembers?.map(m => m.id).join(',') || ''})`)
        .order('created_at', { ascending: false });

      setDashboardData({
        teamMembers: teamMembers || [],
        projects: projects || [],
        recentActivity: [
          ...(teamMembers || []).slice(0, 3).map(member => ({
            type: 'member',
            title: `New team member: ${member.name}`,
            date: member.created_at
          })),
          ...(projects || []).slice(0, 3).map(project => ({
            type: 'project',
            title: `Project: ${project.title}`,
            date: project.created_at
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.AREA_MANAGER]: 'Area Manager',
      [ROLES.PROJECT_MANAGER]: 'Project Manager',
      [ROLES.SOCIAL_WORKER]: 'Social Worker'
    };
    return roleNames[role] || role;
  };

  const getNextRole = (currentRole) => {
    const roleHierarchy = {
      [ROLES.AREA_MANAGER]: ROLES.PROJECT_MANAGER,
      [ROLES.PROJECT_MANAGER]: ROLES.SOCIAL_WORKER
    };
    return roleHierarchy[currentRole];
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {profile?.name}! Here's your ministry overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-blue">
                <Users className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Team Members</p>
                <p className="dashboard-stat-value">{dashboardData.teamMembers.length}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-green">
                <FolderOpen className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Active Projects</p>
                <p className="dashboard-stat-value">
                  {dashboardData.projects.filter(p => p.status === 'ongoing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-yellow">
                <Calendar className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Completed Projects</p>
                <p className="dashboard-stat-value">
                  {dashboardData.projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Team Members */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Team Members</h2>
              {getNextRole(profile?.role) && (
                <button className="dashboard-add-btn">
                  <Plus className="dashboard-add-icon" />
                  Add {getRoleDisplayName(getNextRole(profile?.role))}
                </button>
              )}
            </div>

            <div className="dashboard-team-list">
              {dashboardData.teamMembers.length > 0 ? (
                dashboardData.teamMembers.slice(0, 5).map((member) => (
                  <div key={member.id} className="dashboard-team-member">
                    <div className="dashboard-team-member-info">
                      <div className="dashboard-team-member-avatar">
                        {member.profile_picture_base64 ? (
                          <img
                            src={member.profile_picture_base64}
                            alt={member.name}
                            className="dashboard-team-member-img"
                          />
                        ) : (
                          <div className="dashboard-team-member-initial">
                            {member.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="dashboard-team-member-details">
                        <p className="dashboard-team-member-name">{member.name}</p>
                        <p className="dashboard-team-member-role">{getRoleDisplayName(member.role)}</p>
                      </div>
                    </div>
                    <button className="dashboard-team-member-edit">
                      <Edit className="dashboard-team-member-edit-icon" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty">
                  <Users className="dashboard-empty-icon" />
                  <p className="dashboard-empty-text">No team members yet</p>
                </div>
              )}
            </div>

            {dashboardData.teamMembers.length > 5 && (
              <div className="dashboard-view-all">
                <button className="dashboard-view-all-btn">
                  View all {dashboardData.teamMembers.length} members
                </button>
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Recent Projects</h2>
              <button className="dashboard-add-btn">
                <Plus className="dashboard-add-icon" />
                Add Project
              </button>
            </div>

            <div className="dashboard-projects-list">
              {dashboardData.projects.length > 0 ? (
                dashboardData.projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="dashboard-project-item">
                    <div className="dashboard-project-info">
                      <p className="dashboard-project-title">{project.title}</p>
                      <p className="dashboard-project-status">{project.status}</p>
                    </div>
                    <div className="dashboard-project-actions">
                      <button className="dashboard-project-action">
                        <Eye className="dashboard-project-action-icon" />
                      </button>
                      <button className="dashboard-project-action">
                        <Edit className="dashboard-project-action-icon" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty">
                  <FolderOpen className="dashboard-empty-icon" />
                  <p className="dashboard-empty-text">No projects yet</p>
                </div>
              )}
            </div>

            {dashboardData.projects.length > 5 && (
              <div className="dashboard-view-all">
                <button className="dashboard-view-all-btn">
                  View all {dashboardData.projects.length} projects
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-activity">
          <h2 className="dashboard-activity-title">Recent Activity</h2>
          <div className="dashboard-activity-list">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="dashboard-activity-item">
                  <div className="dashboard-activity-icon">
                    <div className={`dashboard-activity-icon-bg ${
                      activity.type === 'member' ? 'dashboard-activity-icon-blue' : 'dashboard-activity-icon-green'
                    }`}>
                      {activity.type === 'member' ? (
                        <Users className="dashboard-activity-icon-svg" />
                      ) : (
                        <FolderOpen className="dashboard-activity-icon-svg" />
                      )}
                    </div>
                  </div>
                  <div className="dashboard-activity-content">
                    <p className="dashboard-activity-title">{activity.title}</p>
                    <p className="dashboard-activity-date">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="dashboard-activity-empty">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-quick-actions">
          <div className="dashboard-quick-action-card">
            <User className="dashboard-quick-action-icon" />
            <h3 className="dashboard-quick-action-title">Edit Profile</h3>
            <p className="dashboard-quick-action-description">Update your personal information and contact details</p>
            <button 
              className="dashboard-quick-action-btn"
              onClick={() => alert('Edit Profile functionality will be implemented')}
            >
              Edit Profile
            </button>
          </div>

          <div className="dashboard-quick-action-card">
            <FolderOpen className="dashboard-quick-action-icon" />
            <h3 className="dashboard-quick-action-title">Manage Projects</h3>
            <p className="dashboard-quick-action-description">Create and manage your ministry projects</p>
            <button 
              className="dashboard-quick-action-btn"
              onClick={() => alert('Manage Projects functionality will be implemented')}
            >
              Manage Projects
            </button>
          </div>

          <div className="dashboard-quick-action-card">
            <Users className="dashboard-quick-action-icon" />
            <h3 className="dashboard-quick-action-title">Team Management</h3>
            <p className="dashboard-quick-action-description">Manage your team members and their activities</p>
            <button 
              className="dashboard-quick-action-btn"
              onClick={() => alert('Team Management functionality will be implemented')}
            >
              Manage Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

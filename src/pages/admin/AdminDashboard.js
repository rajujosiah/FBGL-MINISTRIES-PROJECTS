import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { Users, FolderOpen, MessageSquare, DollarSign, TrendingUp, UserPlus, Plus, Database } from 'lucide-react';
import '../../styles/pages/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalProjects: 0,
    totalDonations: 0,
    totalBlogPosts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const [membersResult, projectsResult, donationsResult, blogResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('donations').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' })
      ]);

      setStats({
        totalMembers: membersResult.count || 0,
        totalProjects: projectsResult.count || 0,
        totalDonations: donationsResult.count || 0,
        totalBlogPosts: blogResult.count || 0
      });

      // Fetch recent activity
      const { data: recentMembers } = await supabase
        .from('profiles')
        .select('name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentProjects } = await supabase
        .from('projects')
        .select('title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity([
        ...(recentMembers || []).map(member => ({
          type: 'member',
          title: `New ${member.role.replace('_', ' ')} added`,
          description: member.name,
          date: member.created_at
        })),
        ...(recentProjects || []).map(project => ({
          type: 'project',
          title: `New project: ${project.title}`,
          description: `Status: ${project.status}`,
          date: project.created_at
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Team',
      description: 'Add and manage team members',
      icon: <Users className="w-8 h-8" />,
      link: '/admin/team',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Access Control',
      description: 'Manage user permissions',
      icon: <UserPlus className="w-8 h-8" />,
      link: '/admin/access-control',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Blog & Events',
      description: 'Manage content and events',
      icon: <MessageSquare className="w-8 h-8" />,
      link: '/admin/blog',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Sample Data',
      description: 'Populate database with sample data',
      icon: <Database className="w-8 h-8" />,
      link: '/admin/sample-data',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">Manage your ministry operations and team</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <div className="admin-stat-icon admin-stat-icon-blue">
                <Users className="admin-stat-icon-svg" />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Members</p>
                <p className="admin-stat-value">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <div className="admin-stat-icon admin-stat-icon-green">
                <FolderOpen className="admin-stat-icon-svg" />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Projects</p>
                <p className="admin-stat-value">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <div className="admin-stat-icon admin-stat-icon-yellow">
                <DollarSign className="admin-stat-icon-svg" />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Donations</p>
                <p className="admin-stat-value">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-content">
              <div className="admin-stat-icon admin-stat-icon-purple">
                <MessageSquare className="admin-stat-icon-svg" />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Blog Posts</p>
                <p className="admin-stat-value">{stats.totalBlogPosts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-content">
          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <h2 className="admin-quick-actions-title">Quick Actions</h2>
            <div className="admin-quick-actions-list">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="admin-quick-action"
                >
                  <div className={`admin-quick-action-icon ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="admin-quick-action-content">
                    <h3 className="admin-quick-action-title">{action.title}</h3>
                    <p className="admin-quick-action-description">{action.description}</p>
                  </div>
                  <Plus className="admin-quick-action-arrow" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-recent-activity">
            <h2 className="admin-recent-activity-title">Recent Activity</h2>
            <div className="admin-recent-activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="admin-activity-item">
                    <div className="admin-activity-icon">
                      <div className={`admin-activity-icon-bg ${
                        activity.type === 'member' ? 'admin-activity-icon-blue' : 'admin-activity-icon-green'
                      }`}>
                        {activity.type === 'member' ? (
                          <Users className="admin-activity-icon-svg" />
                        ) : (
                          <FolderOpen className="admin-activity-icon-svg" />
                        )}
                      </div>
                    </div>
                    <div className="admin-activity-content">
                      <p className="admin-activity-title">{activity.title}</p>
                      <p className="admin-activity-description">{activity.description}</p>
                      <p className="admin-activity-date">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="admin-activity-empty">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-system-status">
          <h2 className="admin-system-status-title">System Status</h2>
          <div className="admin-system-status-grid">
            <div className="admin-system-status-item">
              <div className="admin-system-status-indicator"></div>
              <span className="admin-system-status-text">Database: Connected</span>
            </div>
            <div className="admin-system-status-item">
              <div className="admin-system-status-indicator"></div>
              <span className="admin-system-status-text">Authentication: Active</span>
            </div>
            <div className="admin-system-status-item">
              <div className="admin-system-status-indicator"></div>
              <span className="admin-system-status-text">Storage: Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

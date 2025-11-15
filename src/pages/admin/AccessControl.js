import React, { useState, useEffect } from 'react';
import { supabase, ROLES } from '../../services/supabaseClient';
import { User, Shield, CheckCircle, XCircle, Edit } from 'lucide-react';
import '../../styles/pages/admin.css';

const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [permissions, setPermissions] = useState({
    can_edit_profile: false,
    can_add_projects: false,
    can_manage_team: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (userId, permission, value) => {
    try {
      const { error } = await supabase
        .from('access_control')
        .upsert({
          user_id: userId,
          [permission]: value
        });

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, [permission]: value }
          : user
      ));
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.ADMIN]: 'Admin',
      [ROLES.AREA_MANAGER]: 'Area Manager',
      [ROLES.PROJECT_MANAGER]: 'Project Manager',
      [ROLES.SOCIAL_WORKER]: 'Social Worker'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      [ROLES.ADMIN]: 'bg-red-100 text-red-800',
      [ROLES.AREA_MANAGER]: 'bg-blue-100 text-blue-800',
      [ROLES.PROJECT_MANAGER]: 'bg-green-100 text-green-800',
      [ROLES.SOCIAL_WORKER]: 'bg-yellow-100 text-yellow-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Access Control</h1>
          <p className="admin-subtitle">Manage user permissions and access levels</p>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  <th className="admin-table-header-cell">
                    User
                  </th>
                  <th className="admin-table-header-cell">
                    Role
                  </th>
                  <th className="admin-table-header-cell">
                    Edit Profile
                  </th>
                  <th className="admin-table-header-cell">
                    Add Projects
                  </th>
                  <th className="admin-table-header-cell">
                    Manage Team
                  </th>
                  <th className="admin-table-header-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {users.map((user) => (
                  <tr key={user.id} className="admin-table-row">
                    <td className="admin-table-cell">
                      <div className="admin-user-info">
                        <div className="admin-user-avatar">
                          {user.profile_picture_base64 ? (
                            <img
                              className="admin-user-img"
                              src={user.profile_picture_base64}
                              alt={user.name}
                            />
                          ) : (
                            <div className="admin-user-initial">
                              <span className="admin-user-initial-text">
                                {user.name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="admin-user-details">
                          <div className="admin-user-name">{user.name}</div>
                          <div className="admin-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <span className={`admin-role-badge ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <button
                        onClick={() => handlePermissionChange(user.id, 'can_edit_profile', !user.can_edit_profile)}
                        className={`admin-permission-btn ${
                          user.can_edit_profile ? 'admin-permission-enabled' : 'admin-permission-disabled'
                        }`}
                      >
                        {user.can_edit_profile ? (
                          <CheckCircle className="admin-permission-icon" />
                        ) : (
                          <XCircle className="admin-permission-icon" />
                        )}
                      </button>
                    </td>
                    <td className="admin-table-cell">
                      <button
                        onClick={() => handlePermissionChange(user.id, 'can_add_projects', !user.can_add_projects)}
                        className={`admin-permission-btn ${
                          user.can_add_projects ? 'admin-permission-enabled' : 'admin-permission-disabled'
                        }`}
                      >
                        {user.can_add_projects ? (
                          <CheckCircle className="admin-permission-icon" />
                        ) : (
                          <XCircle className="admin-permission-icon" />
                        )}
                      </button>
                    </td>
                    <td className="admin-table-cell">
                      <button
                        onClick={() => handlePermissionChange(user.id, 'can_manage_team', !user.can_manage_team)}
                        className={`admin-permission-btn ${
                          user.can_manage_team ? 'admin-permission-enabled' : 'admin-permission-disabled'
                        }`}
                      >
                        {user.can_manage_team ? (
                          <CheckCircle className="admin-permission-icon" />
                        ) : (
                          <XCircle className="admin-permission-icon" />
                        )}
                      </button>
                    </td>
                    <td className="admin-table-cell">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="admin-edit-btn"
                      >
                        <Edit className="admin-action-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Legend */}
        <div className="admin-legend">
          <h3 className="admin-legend-title">Permission Descriptions</h3>
          <div className="admin-legend-grid">
            <div className="admin-legend-item">
              <Shield className="admin-legend-icon" />
              <div className="admin-legend-content">
                <h4 className="admin-legend-item-title">Edit Profile</h4>
                <p className="admin-legend-item-description">Allow user to edit their own profile information</p>
              </div>
            </div>
            <div className="admin-legend-item">
              <Shield className="admin-legend-icon" />
              <div className="admin-legend-content">
                <h4 className="admin-legend-item-title">Add Projects</h4>
                <p className="admin-legend-item-description">Allow user to create and manage projects</p>
              </div>
            </div>
            <div className="admin-legend-item">
              <Shield className="admin-legend-icon" />
              <div className="admin-legend-content">
                <h4 className="admin-legend-item-title">Manage Team</h4>
                <p className="admin-legend-item-description">Allow user to manage team members under them</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const getRoleDashboard = (role) => {
    const roleDashboard = {
      'admin': '/dashboard/admin',
      'area_manager': '/dashboard/area-manager',
      'project_manager': '/dashboard/project-manager',
      'social_worker': '/dashboard/social-worker'
    };
    return roleDashboard[role] || '/dashboard/admin';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If accessing /dashboard without specific path, redirect to role-specific dashboard
  if (location.pathname === '/dashboard') {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;


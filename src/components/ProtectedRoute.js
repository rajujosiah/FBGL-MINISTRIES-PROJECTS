import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="protected-route-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="protected-route-denied">
        <div className="protected-route-denied-content">
          <h1 className="protected-route-denied-title">Access Denied</h1>
          <p className="protected-route-denied-description">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="protected-route-denied-btn"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

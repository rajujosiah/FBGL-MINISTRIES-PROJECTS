import React, { useState } from 'react';
import { populateSampleData, clearAllData } from '../../utils/sampleData';
import { Database, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import '../../styles/pages/admin.css';

const SampleDataManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handlePopulateData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await populateSampleData();
      if (result.success) {
        setMessage('Sample data populated successfully! You can now test the application with realistic data.');
        setMessageType('success');
      } else {
        setMessage('Error populating sample data. Please check the console for details.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error populating sample data: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const result = await clearAllData();
      if (result.success) {
        setMessage('All data cleared successfully!');
        setMessageType('success');
      } else {
        setMessage('Error clearing data. Please check the console for details.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error clearing data: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Sample Data Manager</h1>
          <p className="admin-subtitle">
            Populate your database with sample data for testing and demonstration purposes.
          </p>
        </div>

        {message && (
          <div className={`admin-message ${messageType === 'success' ? 'admin-message-success' : 'admin-message-error'}`}>
            {messageType === 'success' ? (
              <CheckCircle className="admin-message-icon" />
            ) : (
              <AlertCircle className="admin-message-icon" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="admin-content">
          <div className="admin-section">
            <h2 className="admin-section-title">Sample Data Information</h2>
            <div className="admin-info-grid">
              <div className="admin-info-card">
                <Database className="admin-info-icon" />
                <div className="admin-info-content">
                  <h3>Users</h3>
                  <p>5 sample users with different roles:</p>
                  <ul>
                    <li>1 Admin user</li>
                    <li>2 Area Managers</li>
                    <li>1 Project Manager</li>
                    <li>1 Social Worker</li>
                  </ul>
                </div>
              </div>

              <div className="admin-info-card">
                <Database className="admin-info-icon" />
                <div className="admin-info-content">
                  <h3>Projects</h3>
                  <p>4 sample projects across categories:</p>
                  <ul>
                    <li>2 Educational projects</li>
                    <li>1 Economic project</li>
                    <li>1 Social project</li>
                  </ul>
                </div>
              </div>

              <div className="admin-info-card">
                <Database className="admin-info-icon" />
                <div className="admin-info-content">
                  <h3>Blog Posts & Events</h3>
                  <p>3 sample blog posts and events:</p>
                  <ul>
                    <li>2 Blog posts</li>
                    <li>1 Event</li>
                  </ul>
                </div>
              </div>

              <div className="admin-info-card">
                <Database className="admin-info-icon" />
                <div className="admin-info-content">
                  <h3>Donations</h3>
                  <p>3 sample donation records:</p>
                  <ul>
                    <li>2 Completed donations</li>
                    <li>1 Pending donation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Data Management</h2>
            <div className="admin-actions-grid">
              <div className="admin-action-card">
                <div className="admin-action-icon">
                  <Database />
                </div>
                <div className="admin-action-content">
                  <h3>Populate Sample Data</h3>
                  <p>Add sample users, projects, blog posts, and donations to your database.</p>
                  <button
                    onClick={handlePopulateData}
                    disabled={loading}
                    className="admin-add-btn"
                  >
                    {loading ? 'Populating...' : 'Populate Data'}
                  </button>
                </div>
              </div>

              <div className="admin-action-card">
                <div className="admin-action-icon admin-action-icon-danger">
                  <Trash2 />
                </div>
                <div className="admin-action-content">
                  <h3>Clear All Data</h3>
                  <p>Remove all data from the database. Use with caution!</p>
                  <button
                    onClick={handleClearData}
                    disabled={loading}
                    className="admin-delete-btn"
                  >
                    {loading ? 'Clearing...' : 'Clear All Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Sample Login Credentials</h2>
            <div className="admin-credentials">
              <div className="admin-credential-item">
                <strong>Admin:</strong> admin@fbglministry.org / admin123
              </div>
              <div className="admin-credential-item">
                <strong>Area Manager (AP):</strong> area.manager.ap@fbglministry.org / area123
              </div>
              <div className="admin-credential-item">
                <strong>Project Manager:</strong> project.manager.ap@fbglministry.org / project123
              </div>
              <div className="admin-credential-item">
                <strong>Social Worker:</strong> social.worker.ap@fbglministry.org / social123
              </div>
              <div className="admin-credential-item">
                <strong>Area Manager (TS):</strong> area.manager.ts@fbglministry.org / area123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDataManager;


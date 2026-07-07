import React, { useState, useEffect } from 'react';
import {
    getAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    ConnectionError as DataConnectionError
} from '../../utils/dataManager';
import { validateImageFile, compressImage } from '../../utils/imageUtils';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const ManageAdmins = ({ onUpdate }) => {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'admin'
    });
    const [generatedPassword, setGeneratedPassword] = useState(null);
    const [connectionError, setConnectionError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            setConnectionError(null);
            const data = await getAdmins();
            setAdmins(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                setConnectionError('Failed to load admins. Please check your internet connection.');
            }
            setAdmins([]);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Password copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            setConnectionError(null);
            let passwordToDisplay = null;

            if (selectedAdmin) {
                await updateAdmin(selectedAdmin.id, formData);
            } else {
                // Use provided password or generate one if empty (fallback)
                const password = formData.password || Math.random().toString(36).slice(-8);
                passwordToDisplay = password;

                await addAdmin({
                    ...formData,
                    password: password
                });
            }

            // Close form FIRST
            setShowForm(false);
            setFormData({ name: '', username: '', email: '', password: '', role: 'admin' });
            setSelectedAdmin(null);

            // Then show password modal if applicable
            if (passwordToDisplay) {
                setGeneratedPassword(passwordToDisplay);
            }

            await loadAdmins();
            onUpdate?.();
        } catch (error) {
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                setConnectionError('Failed to save admin. Please check your internet connection.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            username: admin.username,
            email: admin.email || '',
            password: '', // Don't populate password on edit
            role: admin.role || 'admin'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        setDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        const id = deleteConfirm;
        setDeleteConfirm(null);

        try {
            setConnectionError(null);
            await deleteAdmin(id);
            alert('Admin deleted successfully!');
            await loadAdmins();
            onUpdate?.();
        } catch (error) {
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                alert(`Failed to delete admin: ${error.message || 'Unknown error'}`);
                setConnectionError('Failed to delete admin. Please check your internet connection.');
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    return (
        <div className="manage-section">
            {connectionError && (
                <ConnectionError
                    message={connectionError}
                    onRetry={loadAdmins}
                />
            )}

            {generatedPassword && (
                <div className="form-modal" style={{ zIndex: 2000 }}>
                    <div className="form-modal-content">
                        <div className="form-modal-header">
                            <h3>Admin Created</h3>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <p>The admin has been created successfully.</p>
                            <p>Please share the following password with the user:</p>
                            <div className="password-display">
                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{generatedPassword}</p>
                                <button
                                    type="button"
                                    className="btn-icon"
                                    onClick={() => copyToClipboard(generatedPassword)}
                                    title="Copy Password"
                                    style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    📋
                                </button>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-primary" onClick={() => setGeneratedPassword(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="section-header">
                <div>
                    <h2>Manage Admins</h2>
                    <p className="section-description" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        Create and manage other Admin users who can access this dashboard.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedAdmin(null); }}>
                    + Add Admin
                </button>
            </div>

            {showForm && (
                <div className="form-modal">
                    <div className="form-modal-content">
                        <div className="form-modal-header">
                            <h3>{selectedAdmin ? 'Edit Admin' : 'Add Admin'}</h3>
                            <button className="close-btn" onClick={() => { setShowForm(false); setSelectedAdmin(null); }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    disabled={!!selectedAdmin} // Disable username editing for existing admins
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            {!selectedAdmin && (
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedAdmin(null); }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="managers-grid">
                {admins.map(admin => (
                    <div key={admin.id} className="manager-card">
                        <div className="manager-header">
                            <div className="manager-info">
                                <h3>{admin.name}</h3>
                                <p className="manager-id">{admin.username}</p>
                            </div>
                        </div>
                        <div className="manager-details">
                            {admin.email && <p><strong>Email:</strong> {admin.email}</p>}
                            <p><strong>Role:</strong> {admin.role}</p>
                        </div>
                        <div className="manager-actions">
                            <button className="btn-small btn-secondary" onClick={() => handleEdit(admin)}>
                                Edit
                            </button>
                            <button className="btn-small btn-danger" onClick={() => handleDelete(admin.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {admins.length === 0 && (
                <p className="empty-state">No Admins found.</p>
            )}

            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <p>Are you sure you want to delete this Admin?</p>
                            <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: '1rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="form-actions">
                            <button className="btn-danger" onClick={confirmDelete}>
                                Delete
                            </button>
                            <button className="btn-secondary" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmins;

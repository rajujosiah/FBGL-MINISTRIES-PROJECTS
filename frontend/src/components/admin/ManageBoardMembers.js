import React, { useState, useEffect } from 'react';
import { IoMdPerson, IoMdAdd, IoMdTrash, IoMdCreate } from 'react-icons/io';
import { getBoardMembers, addBoardMember, updateBoardMember, deleteBoardMember, ConnectionError as DataConnectionError } from '../../utils/dataManager';
import { validateImageFile, compressImage } from '../../utils/imageUtils';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const ManageBoardMembers = ({ onUpdate }) => {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        bio: '',
        profile_picture: ''
    });
    const [uploading, setUploading] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // Store ID of member to delete

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            setConnectionError(null);
            const data = await getBoardMembers();
            setMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                setConnectionError('Failed to load board members. Please check your internet connection.');
            }
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            setConnectionError(null);

            if (selectedMember) {
                await updateBoardMember(selectedMember.id, formData);
                alert('Board member updated successfully!');
            } else {
                await addBoardMember(formData);
                alert('Board member added successfully!');
            }

            setShowForm(false);
            setFormData({ name: '', position: '', bio: '', profile_picture: '' });
            setSelectedMember(null);
            await loadMembers();
            onUpdate?.();
        } catch (error) {
            console.error('Error saving board member:', error);
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                setConnectionError('Failed to save board member. Please check your internet connection.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        try {
            setUploading(true);
            const compressedImage = await compressImage(file);
            setFormData({ ...formData, profile_picture: compressedImage });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
        setFormData({
            name: member.name || '',
            position: member.position || '',
            bio: member.bio || '',
            profile_picture: member.profile_picture || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        console.log('handleDelete called with ID:', id);
        setDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        const id = deleteConfirm;
        console.log('User confirmed deletion for ID:', id);
        setDeleteConfirm(null);

        try {
            setConnectionError(null);
            console.log('About to call deleteBoardMember with ID:', id);
            const result = await deleteBoardMember(id);
            console.log('deleteBoardMember returned:', result);
            alert('Board member deleted successfully!');
            console.log('Reloading members...');
            await loadMembers();
            console.log('Members reloaded');
            onUpdate?.();
        } catch (error) {
            console.error('Delete error:', error);
            if (error instanceof DataConnectionError) {
                setConnectionError(error.message);
            } else {
                alert(`Failed to delete board member: ${error.message || 'Unknown error'}`);
                setConnectionError('Failed to delete board member. Please check your internet connection.');
            }
        }
    };

    const cancelDelete = () => {
        console.log('User cancelled deletion');
        setDeleteConfirm(null);
    };

    return (
        <div className="manage-section">
            {connectionError && (
                <ConnectionError
                    message={connectionError}
                    onRetry={loadMembers}
                />
            )}

            <div className="section-header">
                <h2>Manage Board Members</h2>
                <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedMember(null); setFormData({ name: '', position: '', bio: '', profile_picture: '' }); }}>
                    <IoMdAdd /> Add Board Member
                </button>
            </div>

            {showForm && (
                <div className="form-modal">
                    <div className="form-modal-content">
                        <div className="form-modal-header">
                            <h3>{selectedMember ? 'Edit Board Member' : 'Add Board Member'}</h3>
                            <button className="close-btn" onClick={() => { setShowForm(false); setSelectedMember(null); }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Full Name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Position/Role *</label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                    placeholder="e.g. Chairman, Secretary"
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows="4"
                                    placeholder="Short biography"
                                />
                            </div>

                            <div className="form-group">
                                <label>Profile Picture</label>
                                {formData.profile_picture && (
                                    <div className="image-preview">
                                        <img src={formData.profile_picture} alt="Preview" />
                                        <button type="button" onClick={() => setFormData({ ...formData, profile_picture: '' })}>Remove</button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={uploading}>
                                    {uploading ? 'Saving...' : selectedMember ? 'Update Member' : 'Add Member'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedMember(null); }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <p>Are you sure you want to delete this board member?</p>
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


            {loading ? (
                <div className="loading">Loading board members...</div>
            ) : (
                <div className="members-grid">
                    {members.map(member => (
                        <div key={member.id} className="member-card">
                            <div className="member-photo">
                                {member.profile_picture ? (
                                    <img src={member.profile_picture} alt={member.name} />
                                ) : (
                                    <div className="placeholder-photo"><IoMdPerson /></div>
                                )}
                            </div>
                            <div className="member-info">
                                <h3>{member.name}</h3>
                                <p className="member-role">{member.position}</p>
                                {member.bio && <p className="member-bio">{member.bio.substring(0, 100)}...</p>}
                                <div className="member-actions">
                                    <button className="btn-icon" onClick={() => handleEdit(member)} title="Edit">
                                        <IoMdCreate />
                                    </button>
                                    <button
                                        className="btn-icon delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(member.id);
                                        }}
                                        title="Delete"
                                    >
                                        <IoMdTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="empty-state">
                            <p>No board members found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageBoardMembers;

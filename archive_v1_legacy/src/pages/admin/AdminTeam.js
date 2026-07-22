import React, { useState, useEffect } from 'react';
import { supabase, ROLES } from '../../services/supabaseClient';
import { generateFBGLId, getNextCount, STATE_CODES, DISTRICT_CODES, ROLE_CODES } from '../../utils/idGenerator';
import { compressImageToBase64 } from '../../utils/imageCompression';
import { Plus, Edit, Trash2, User, Upload, X } from 'lucide-react';
import '../../styles/pages/admin.css';

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.AREA_MANAGER,
    state_code: 'AP',
    district_code: 'EG',
    address: '',
    aadhar_no: '',
    assigned_to: null
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const generateIdNumber = async () => {
    try {
      const { data: existingIds } = await supabase
        .from('profiles')
        .select('id_number')
        .eq('state_code', formData.state_code)
        .eq('district_code', formData.district_code);

      const idNumbers = existingIds?.map(item => item.id_number) || [];
      const nextCount = getNextCount(
        formData.state_code,
        formData.district_code,
        ROLE_CODES[formData.role],
        idNumbers
      );

      return generateFBGLId(
        formData.state_code,
        formData.district_code,
        ROLE_CODES[formData.role],
        nextCount
      );
    } catch (error) {
      console.error('Error generating ID:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let profileImageBase64 = null;
      if (profileImage) {
        profileImageBase64 = await compressImageToBase64(profileImage);
      }

      const idNumber = await generateIdNumber();
      if (!idNumber) {
        throw new Error('Failed to generate ID number');
      }

      const memberData = {
        ...formData,
        id_number: idNumber,
        profile_picture_base64: profileImageBase64,
        is_active: true,
        created_at: new Date().toISOString()
      };

      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('profiles')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        // Create new member
        const { error } = await supabase
          .from('profiles')
          .insert([memberData]);

        if (error) throw error;
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: ROLES.AREA_MANAGER,
        state_code: 'AP',
        district_code: 'EG',
        address: '',
        aadhar_no: '',
        assigned_to: null
      });
      setProfileImage(null);
      setImagePreview(null);
      setShowForm(false);
      setEditingMember(null);

      // Refresh data
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || ROLES.AREA_MANAGER,
      state_code: member.state_code || 'AP',
      district_code: member.district_code || 'EG',
      address: member.address || '',
      aadhar_no: member.aadhar_no || '',
      assigned_to: member.assigned_to || null
    });
    setImagePreview(member.profile_picture_base64);
    setShowForm(true);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Error deleting team member. Please try again.');
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
          <div className="admin-header-content">
            <h1 className="admin-title">Team Management</h1>
            <p className="admin-subtitle">Manage your ministry team members</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="admin-add-btn"
          >
            <Plus className="admin-add-icon" />
            Add Team Member
          </button>
        </div>

        {/* Team Members Table */}
        <div className="admin-table-container">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  <th className="admin-table-header-cell">
                    Member
                  </th>
                  <th className="admin-table-header-cell">
                    Role
                  </th>
                  <th className="admin-table-header-cell">
                    ID Number
                  </th>
                  <th className="admin-table-header-cell">
                    Location
                  </th>
                  <th className="admin-table-header-cell">
                    Contact
                  </th>
                  <th className="admin-table-header-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="admin-table-row">
                    <td className="admin-table-cell">
                      <div className="admin-member-info">
                        <div className="admin-member-avatar">
                          {member.profile_picture_base64 ? (
                            <img
                              className="admin-member-img"
                              src={member.profile_picture_base64}
                              alt={member.name}
                            />
                          ) : (
                            <div className="admin-member-initial">
                              <span className="admin-member-initial-text">
                                {member.name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="admin-member-details">
                          <div className="admin-member-name">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <span className="admin-role-badge">
                        {getRoleDisplayName(member.role)}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <span className="admin-id-number">{member.id_number}</span>
                    </td>
                    <td className="admin-table-cell">
                      <span className="admin-location">{member.state_code} - {member.district_code}</span>
                    </td>
                    <td className="admin-table-cell">
                      <span className="admin-contact">{member.email || member.phone}</span>
                    </td>
                    <td className="admin-table-cell">
                      <div className="admin-actions">
                        <button
                          onClick={() => handleEdit(member)}
                          className="admin-edit-btn"
                        >
                          <Edit className="admin-action-icon" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="admin-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        role: ROLES.AREA_MANAGER,
                        state_code: 'AP',
                        district_code: 'EG',
                        address: '',
                        aadhar_no: '',
                        assigned_to: null
                      });
                      setImagePreview(null);
                    }}
                    className="admin-modal-close"
                  >
                    <X className="admin-modal-close-icon" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                  {/* Profile Image */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Profile Picture
                    </label>
                    <div className="admin-image-upload">
                      <div className="admin-image-preview">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="admin-image-preview-img"
                          />
                        ) : (
                          <div className="admin-image-placeholder">
                            <User className="admin-image-placeholder-icon" />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="admin-file-input"
                          id="profile-image"
                        />
                        <label
                          htmlFor="profile-image"
                          className="admin-upload-btn"
                        >
                          <Upload className="admin-upload-icon" />
                          Upload Image
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="admin-form-grid">
                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="admin-form-input"
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="admin-form-input"
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="admin-form-input"
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        Role *
                      </label>
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        className="admin-form-select"
                      >
                        <option value={ROLES.AREA_MANAGER}>Area Manager</option>
                        <option value={ROLES.PROJECT_MANAGER}>Project Manager</option>
                        <option value={ROLES.SOCIAL_WORKER}>Social Worker</option>
                      </select>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        State *
                      </label>
                      <select
                        name="state_code"
                        required
                        value={formData.state_code}
                        onChange={handleInputChange}
                        className="admin-form-select"
                      >
                        {Object.entries(STATE_CODES).map(([state, code]) => (
                          <option key={code} value={code}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">
                        District *
                      </label>
                      <select
                        name="district_code"
                        required
                        value={formData.district_code}
                        onChange={handleInputChange}
                        className="admin-form-select"
                      >
                        {Object.entries(DISTRICT_CODES).map(([district, code]) => (
                          <option key={code} value={code}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Address
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="admin-form-textarea"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadhar_no"
                      value={formData.aadhar_no}
                      onChange={handleInputChange}
                      className="admin-form-input"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="admin-form-actions">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="admin-form-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="admin-form-submit"
                    >
                      {submitting ? 'Saving...' : (editingMember ? 'Update' : 'Add')} Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeam;

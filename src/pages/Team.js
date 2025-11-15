import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, ROLES } from '../services/supabaseClient';
import '../styles/pages/team.css';
import { User, Phone, Mail, MapPin, ArrowLeft, Users, ChevronRight } from 'lucide-react';

const Team = () => {
  const { role, id } = useParams();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
  }, [role, id]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('profiles').select('*').eq('is_active', true);

      if (role && id) {
        // Fetch specific role members under a parent
        query = query.eq('role', role).eq('assigned_to', id);
      } else if (role) {
        // Fetch all members of a specific role
        query = query.eq('role', role);
      } else {
        // Fetch area managers (top level)
        query = query.eq('role', ROLES.AREA_MANAGER);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
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

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleRoleNavigation = (member) => {
    const nextRole = getNextRole(member.role);
    if (nextRole) {
      window.location.href = `/team/${nextRole}/${member.id}`;
    }
  };

  if (loading) {
    return (
      <div className="team-loading">
        <div className="team-loading-content">
          <div className="team-loading-spinner"></div>
          <p className="team-loading-text">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <div className="team-hero-overlay"></div>
        <div className="team-hero-container">
          <div className="team-hero-content">
            <div className="team-hero-badge">
              <Users className="team-hero-badge-icon" />
              <span className="team-hero-badge-text">Our Team</span>
            </div>
            <h1 className="team-hero-title">
              Meet Our
              <span className="team-hero-title-accent">
                Dedicated Team
              </span>
            </h1>
            <p className="team-hero-description">
              The passionate individuals who make our ministry's mission possible through their dedication and service
            </p>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="team-hero-bg team-hero-bg-1"></div>
        <div className="team-hero-bg team-hero-bg-2"></div>
      </section>

      <div className="team-content">
        {/* Team Grid */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-content">
                {/* Profile Picture */}
                <div className="team-card-avatar">
                  <div className="team-card-avatar-image">
                    {member.profile_picture_base64 ? (
                      <img
                        src={member.profile_picture_base64}
                        alt={member.name}
                        className="team-card-avatar-img"
                      />
                    ) : (
                      <div className="team-card-avatar-placeholder">
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="team-card-avatar-badge">
                    <span className="team-card-avatar-badge-text">✓</span>
                  </div>
                </div>

                {/* Member Info */}
                <h3 className="team-card-name">{member.name}</h3>
                <div className="team-card-role">
                  {getRoleDisplayName(member.role)}
                </div>
                <p className="team-card-id">ID: {member.id_number}</p>
                <p className="team-card-location">
                  {member.state_code} - {member.district_code}
                </p>

                {/* Contact Info */}
                <div className="team-card-contact">
                  {member.phone && (
                    <div className="team-card-contact-item">
                      <Phone className="team-card-contact-icon" />
                      <span className="team-card-contact-text">{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="team-card-contact-item">
                      <Mail className="team-card-contact-icon" />
                      <span className="team-card-contact-text">{member.email}</span>
                    </div>
                  )}
                  {member.address && (
                    <div className="team-card-contact-item">
                      <MapPin className="team-card-contact-icon" />
                      <span className="team-card-contact-text">{member.address}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="team-card-actions">
                  <button
                    onClick={() => handleMemberClick(member)}
                    className="team-card-btn team-card-btn-primary"
                  >
                    View Profile
                  </button>
                  
                  {getNextRole(member.role) && (
                    <button
                      onClick={() => handleRoleNavigation(member)}
                      className="team-card-btn team-card-btn-secondary"
                    >
                      View {getRoleDisplayName(getNextRole(member.role))}s
                      <ChevronRight className="team-card-btn-icon" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div className="team-empty">
            <Users className="team-empty-icon" />
            <h3 className="team-empty-title">No team members found</h3>
            <p className="team-empty-description">There are no team members in this category yet.</p>
          </div>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="team-modal">
            <div className="team-modal-content">
              <div className="team-modal-header">
                <h2 className="team-modal-title">Member Profile</h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="team-modal-close"
                >
                  <ArrowLeft className="team-modal-close-icon" />
                </button>
              </div>

              <div className="team-modal-body">
                {/* Profile Picture */}
                <div className="team-modal-avatar">
                  <div className="team-modal-avatar-image">
                    {selectedMember.profile_picture_base64 ? (
                      <img
                        src={selectedMember.profile_picture_base64}
                        alt={selectedMember.name}
                        className="team-modal-avatar-img"
                      />
                    ) : (
                      <div className="team-modal-avatar-placeholder">
                        {selectedMember.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Details */}
                <div className="team-modal-details">
                  <div className="team-modal-member-info">
                    <h3 className="team-modal-member-name">{selectedMember.name}</h3>
                    <p className="team-modal-member-role">{getRoleDisplayName(selectedMember.role)}</p>
                  </div>

                  <div className="team-modal-fields">
                    <div className="team-modal-field">
                      <label className="team-modal-field-label">ID Number</label>
                      <p className="team-modal-field-value">{selectedMember.id_number}</p>
                    </div>

                    <div className="team-modal-field">
                      <label className="team-modal-field-label">Location</label>
                      <p className="team-modal-field-value">{selectedMember.state_code} - {selectedMember.district_code}</p>
                    </div>

                    {selectedMember.phone && (
                      <div className="team-modal-field">
                        <label className="team-modal-field-label">Phone</label>
                        <p className="team-modal-field-value">{selectedMember.phone}</p>
                      </div>
                    )}

                    {selectedMember.email && (
                      <div className="team-modal-field">
                        <label className="team-modal-field-label">Email</label>
                        <p className="team-modal-field-value">{selectedMember.email}</p>
                      </div>
                    )}

                    {selectedMember.address && (
                      <div className="team-modal-field">
                        <label className="team-modal-field-label">Address</label>
                        <p className="team-modal-field-value">{selectedMember.address}</p>
                      </div>
                    )}

                    {selectedMember.aadhar_no && (
                      <div className="team-modal-field">
                        <label className="team-modal-field-label">Aadhar Number</label>
                        <p className="team-modal-field-value">{selectedMember.aadhar_no}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="team-modal-actions">
                {getNextRole(selectedMember.role) && (
                  <button
                    onClick={() => {
                      handleRoleNavigation(selectedMember);
                      setSelectedMember(null);
                    }}
                    className="team-modal-btn team-modal-btn-primary"
                  >
                    View {getRoleDisplayName(getNextRole(selectedMember.role))}s
                  </button>
                )}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="team-modal-btn team-modal-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;

import React from 'react';
import { IoMdMail } from 'react-icons/io';
import './IDCard.css';

const IDCard = ({ user, role }) => {
  if (!user) return null;

  const getRoleLabel = () => {
    const roleMap = {
      'admin': 'ADMINISTRATOR',
      'area_manager': 'AREA MANAGER',
      'project_manager': 'PROJECT MANAGER',
      'social_worker': 'SOCIAL WORKER',
      'board_member': 'BOARD MEMBER'
    };
    return roleMap[role || user.role] || 'MEMBER';
  };

  // Get profile picture or generate placeholder
  const profilePicture = user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e3c72&color=fff&size=200&bold=true`;

  return (
    <div className="id-card">
      {/* Decorative Background Elements */}
      <div className="card-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="card-inner">
        {/* Top Section with Logo and Header */}
        <div className="card-header">
          <div className="header-left">
            <div className="logo-container">
              <img 
                src={process.env.PUBLIC_URL + '/logo.png'} 
                alt="FBGL Logo" 
                className="org-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="logo-placeholder">FBGL</div>
            </div>
          </div>
          <div className="header-right">
            <div className="org-name">FIRST BORN GOSPEL LIFE</div>
            <div className="org-subtitle">MINISTRIES</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="card-body">
          {/* Left Side - Photo */}
          <div className="photo-container">
            <div className="photo-frame">
              <img 
                src={profilePicture}
                alt={user.name}
                className="user-photo"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e3c72&color=fff&size=200&bold=true`;
                }}
              />
              <div className="photo-badge">{getRoleLabel()}</div>
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="info-container">
            <div className="user-name">{user.name?.toUpperCase() || 'NAME HERE'}</div>
            
            {user.id_no && (
              <div className="info-row">
                <span className="info-label">ID Number</span>
                <span className="info-value">{user.id_no}</span>
              </div>
            )}

            <div className="info-row">
              <span className="info-label">Designation</span>
              <span className="info-value">{getRoleLabel()}</span>
            </div>

            {user.state && (
              <div className="info-row">
                <span className="info-label">State</span>
                <span className="info-value">{user.state}</span>
              </div>
            )}

            {user.district && (
              <div className="info-row">
                <span className="info-label">District</span>
                <span className="info-value">{user.district}</span>
              </div>
            )}

            {user.phone && (
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Footer */}
        <div className="card-footer">
          <div className="footer-left">
            {user.email && (
              <div className="contact-item">
                <IoMdMail className="contact-icon" />
                <span className="contact-text">{user.email}</span>
              </div>
            )}
            <div className="website">www.fbglministries.com</div>
          </div>
          <div className="footer-right">
            <div className="reg-number">Reg. No: 17/2016</div>
          </div>
        </div>

        {/* Security Features */}
        <div className="security-elements">
          <div className="watermark">FBGL</div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;

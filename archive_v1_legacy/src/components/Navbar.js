import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import '../styles/components/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Our Team', path: '/team' },
    { name: 'Our Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
    { name: 'Donate', path: '/donate' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo and Brand */}
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <img 
                src="/logo.png" 
                alt="FBGL Ministries Logo" 
                className="navbar-logo-img"
              />
            </div>
            <div className="navbar-brand-text">
              <h1 className="navbar-brand-title">FIRST BORN GOSPEL LIFE</h1>
              <p className="navbar-brand-subtitle">MINISTRIES</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-nav-item ${
                  isActive(item.path) ? 'active' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="navbar-user">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="navbar-user-info"
                >
                  <div className="navbar-user-avatar-container">
                    <User className="navbar-user-avatar" />
                  </div>
                  <span className="navbar-user-name">{profile?.name || 'User'}</span>
                </button>

                {isProfileOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{profile?.name}</p>
                      <p className="navbar-dropdown-role">{profile?.role?.replace('_', ' ')}</p>
                    </div>
                    
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="navbar-dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="navbar-dropdown-icon" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="navbar-dropdown-icon" />
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="navbar-dropdown-item"
                    >
                      <LogOut className="navbar-dropdown-icon" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="navbar-login-btn"
              >
                <User className="navbar-login-icon" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-mobile-btn"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu" ref={mobileMenuRef}>
            <div className="navbar-mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`navbar-mobile-nav-item ${
                    isActive(item.path) ? 'active' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

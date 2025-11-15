import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const logo = process.env.PUBLIC_URL + '/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogoClick = () => {
    navigate('/');
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section" onClick={handleLogoClick}>
          <img src={logo} alt="FBGL Ministries Logo" className="logo-img" />
          <div className="logo">
            <h1>FBGL Ministries</h1>
            <p className="tagline">Transforming Lives through Social, Economic & Educational Empowerment</p>
          </div>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" onClick={handleNavClick}>Home</Link>
          <Link to="/team" onClick={handleNavClick}>Our Team</Link>
          <Link to="/projects" onClick={handleNavClick}>Our Projects</Link>
          <Link to="/contact" onClick={handleNavClick}>Contact</Link>
          <Link to="/donate" onClick={handleNavClick} className="donate-btn">Donate</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;


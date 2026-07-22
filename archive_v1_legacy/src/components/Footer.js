import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/components/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Ministry Info */}
          <div className="footer-ministry">
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src="/logo.png" 
                  alt="FBGL Ministries Logo" 
                  className="footer-logo-img"
                />
              </div>
              <div>
                <h3 className="footer-title">FIRST BORN GOSPEL LIFE</h3>
                <p className="footer-subtitle">MINISTRIES</p>
              </div>
            </div>
            <p className="footer-reg">
              Reg. No: 17/2016
            </p>
            <p className="footer-description">
              Transforming Lives through Social, Economic & Educational Empowerment in Christ.
            </p>
            
            {/* Social Media Links */}
            <div className="footer-social">
              <a href="https://facebook.com" className="footer-social-link">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" className="footer-social-link">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" className="footer-social-link">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://whatsapp.com" className="footer-social-link">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/team" className="footer-link">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/projects" className="footer-link">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/donate" className="footer-link">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-contact-title">Contact Info</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-contact-text">
                  Ministry Office Address<br />
                  City, State, Country
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+91 1234567890</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-contact-text">info@fbglministries.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {currentYear} FIRST BORN GOSPEL LIFE MINISTRIES. All rights reserved.
            </div>
            <div className="footer-developer">
              Designed & Developed by{' '}
              <span className="footer-developer-name">Kingdom Creative Media</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

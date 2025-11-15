import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>FIRST BORN GOSPEL LIFE MINISTRIES</h1>
          <p className="hero-subtitle">Registration No: Reg. 17/2016</p>
          <p className="hero-tagline">Transforming Lives through Social, Economic & Educational Empowerment in Christ</p>
          <div className="hero-buttons">
            <Link to="/team" className="btn btn-primary">Learn More</Link>
            <Link to="/contact" className="btn btn-secondary">Join Us</Link>
            <Link to="/donate" className="btn btn-gold">Donate Now</Link>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="welcome-section">
        <div className="container">
          <h2>Welcome Message</h2>
          <p className="welcome-text">
            Welcome to FIRST BORN GOSPEL LIFE MINISTRIES, a faith-based non-profit organization 
            dedicated to transforming communities through social development, economic empowerment, 
            and educational support programs inspired by the Gospel of Christ.
          </p>
          <p className="welcome-text">
            We believe in the power of love, compassion, and service to create lasting change in 
            the lives of individuals and communities. Through our programs, we strive to bring hope, 
            opportunity, and transformation to those who need it most.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card">
              <h3>Vision</h3>
              <p>To be a beacon of hope, transforming lives and communities through the Gospel of Christ.</p>
            </div>
            <div className="vm-card">
              <h3>Mission</h3>
              <p>To empower individuals and communities through social, economic, and educational initiatives that reflect the love of Christ.</p>
            </div>
            <div className="vm-card">
              <h3>Purpose</h3>
              <p>To serve the underserved, uplift the marginalized, and create pathways to sustainable development and empowerment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="focus-areas">
        <div className="container">
          <h2>Our Key Focus Areas</h2>
          <div className="focus-grid">
            <div className="focus-card">
              <div className="focus-icon">👥</div>
              <h3>Social</h3>
              <p>Community development, health awareness, and social welfare programs that strengthen families and neighborhoods.</p>
              <Link to="/projects?category=social" className="focus-link">View Projects →</Link>
            </div>
            <div className="focus-card">
              <div className="focus-icon">💼</div>
              <h3>Economy</h3>
              <p>Economic empowerment through skill development, micro-enterprise support, and financial literacy programs.</p>
              <Link to="/projects?category=economy" className="focus-link">View Projects →</Link>
            </div>
            <div className="focus-card">
              <div className="focus-icon">📚</div>
              <h3>Education</h3>
              <p>Educational support, scholarships, tutoring programs, and resources to ensure every child has access to quality education.</p>
              <Link to="/projects?category=education" className="focus-link">View Projects →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Join Us in Making a Difference</h2>
          <p>Your support can transform lives. Become a part of our mission today.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Get Involved</Link>
            <Link to="/donate" className="btn btn-gold">Support Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;



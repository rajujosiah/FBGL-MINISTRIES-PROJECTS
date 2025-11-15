import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, ArrowRight, Star } from 'lucide-react';
import '../styles/pages/home.css';

const Home = () => {
  const focusAreas = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Social Development',
      description: 'Building stronger communities through social programs and support services.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Economic Empowerment',
      description: 'Creating sustainable livelihoods and economic opportunities for families.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Educational Support',
      description: 'Providing quality education and learning opportunities for all ages.',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Community Member',
      content: 'FBGL Ministries has transformed our community through their educational programs.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Project Beneficiary',
      content: 'The economic empowerment program helped me start my own business.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Volunteer',
      content: 'Working with FBGL has been a life-changing experience for me.',
      rating: 5
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <span className="home-hero-badge-text">Registration No: 17/2016</span>
          </div>
          <h1 className="home-hero-title">
            FIRST BORN GOSPEL LIFE
            <span className="home-hero-gradient">
              MINISTRIES
            </span>
          </h1>
          <p className="home-hero-subtitle">
            Transforming Lives through Social, Economic & Educational Empowerment in Christ
          </p>
          <p className="home-hero-description">
            Building stronger communities through faith, hope, and love
          </p>
          <div className="home-hero-buttons">
            <Link
              to="/team"
              className="home-hero-btn home-hero-btn-primary"
            >
              Learn More
              <ArrowRight className="home-hero-btn-icon" />
            </Link>
            <Link
              to="/donate"
              className="home-hero-btn home-hero-btn-secondary"
            >
              Donate Now
              <Heart className="home-hero-btn-icon" />
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="home-hero-floating home-hero-floating-1"></div>
        <div className="home-hero-floating home-hero-floating-2"></div>
        <div className="home-hero-floating home-hero-floating-3"></div>
      </section>

      {/* Welcome Message */}
      <section className="home-welcome">
        <div className="home-welcome-container">
          <div className="home-welcome-header">
            <div className="home-welcome-badge">
              <span className="home-welcome-badge-dot"></span>
              Welcome to Our Ministry
            </div>
            <h2 className="home-welcome-title">
              Transforming Communities
              <span className="home-welcome-title-accent">Through Christ's Love</span>
            </h2>
            <p className="home-welcome-description">
              At FIRST BORN GOSPEL LIFE MINISTRIES, we are dedicated to transforming communities 
              through comprehensive social development, economic empowerment, and educational 
              support programs inspired by the Gospel of Christ.
            </p>
          </div>
          
          {/* Stats */}
          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-number">500+</div>
              <div className="home-stat-label">Lives Transformed</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">50+</div>
              <div className="home-stat-label">Projects Completed</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">15+</div>
              <div className="home-stat-label">Years of Service</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-number">10+</div>
              <div className="home-stat-label">Communities Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="home-focus">
        <div className="home-focus-container">
          <div className="home-focus-header">
            <div className="home-focus-badge">
              <span className="home-focus-badge-dot"></span>
              Our Focus Areas
            </div>
            <h2 className="home-focus-title">
              Creating Lasting Impact
            </h2>
            <p className="home-focus-description">
              We work across three key areas to create lasting impact in communities
            </p>
          </div>
          
          <div className="home-focus-areas">
            {focusAreas.map((area, index) => (
              <div key={index} className="home-focus-card">
                <div className="home-focus-card-icon">
                  {area.icon}
                </div>
                <h3 className="home-focus-card-title">{area.title}</h3>
                <p className="home-focus-card-description">{area.description}</p>
                <div className="home-focus-card-link">
                  <Link
                    to="/projects"
                    className="home-focus-card-link-text"
                  >
                    Learn More
                    <ArrowRight className="home-focus-card-link-icon" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <div className="home-testimonials-container">
          <div className="home-testimonials-header">
            <div className="home-testimonials-badge">
              <span className="home-testimonials-badge-dot"></span>
              What People Say
            </div>
            <h2 className="home-testimonials-title">
              Stories of Transformation
            </h2>
            <p className="home-testimonials-description">
              Real stories of hope and transformation from our community
            </p>
          </div>
          
          <div className="home-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="home-testimonial-card">
                <div className="home-testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="home-testimonial-star" />
                  ))}
                </div>
                <blockquote className="home-testimonial-content">
                  "{testimonial.content}"
                </blockquote>
                <div className="home-testimonial-author">
                  <div className="home-testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="home-testimonial-info">
                    <p className="home-testimonial-name">{testimonial.name}</p>
                    <p className="home-testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="home-cta">
        <div className="home-cta-overlay"></div>
        <div className="home-cta-container">
          <div className="home-cta-content">
            <div className="home-cta-badge">
              <span className="home-cta-badge-text">Join Our Mission</span>
            </div>
            <h2 className="home-cta-title">
              Join Us in Making a
              <span className="home-cta-title-accent">
                Difference
              </span>
            </h2>
            <p className="home-cta-description">
              Together, we can transform lives and build stronger communities through faith, hope, and love
            </p>
            <div className="home-cta-buttons">
              <Link
                to="/contact"
                className="home-cta-btn home-cta-btn-primary"
              >
                Get Involved
                <ArrowRight className="home-cta-btn-icon" />
              </Link>
              <Link
                to="/projects"
                className="home-cta-btn home-cta-btn-secondary"
              >
                View Our Projects
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="home-cta-bg home-cta-bg-1"></div>
        <div className="home-cta-bg home-cta-bg-2"></div>
      </section>
    </div>
  );
};

export default Home;

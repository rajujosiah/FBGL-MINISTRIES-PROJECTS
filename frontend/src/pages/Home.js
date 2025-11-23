import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBlogPosts, initializeData, getHomePageProjects } from '../utils/dataManager';
import { IoMdPeople, IoMdBriefcase, IoMdSchool } from 'react-icons/io';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [homeProjects, setHomeProjects] = useState([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      await initializeData();
      const posts = await getBlogPosts();
      // Get latest 3 blog posts
      if (Array.isArray(posts)) {
        setBlogPosts(posts.slice(-3).reverse());
      }
    };

    const loadHomeProjects = async () => {
      try {
        const projects = await getHomePageProjects();
        setHomeProjects(projects);
      } catch (error) {
        console.error('Error loading home projects:', error);
      }
    };

    loadBlogPosts();
    loadHomeProjects();
  }, []);
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
              <IoMdPeople className="focus-icon" />
              <h3>Social</h3>
              <p>Community development, health awareness, and social welfare programs that strengthen families and neighborhoods.</p>
              <Link to="/projects?category=social" className="focus-link">View Projects →</Link>
            </div>
            <div className="focus-card">
              <IoMdBriefcase className="focus-icon" />
              <h3>Economy</h3>
              <p>Economic empowerment through skill development, micro-enterprise support, and financial literacy programs.</p>
              <Link to="/projects?category=economy" className="focus-link">View Projects →</Link>
            </div>
            <div className="focus-card">
              <IoMdSchool className="focus-icon" />
              <h3>Education</h3>
              <p>Educational support, scholarships, tutoring programs, and resources to ensure every child has access to quality education.</p>
              <Link to="/projects?category=education" className="focus-link">View Projects →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {homeProjects.length > 0 && (
        <section className="blog-section">
          <div className="container">
            <h2>Our Featured Projects</h2>
            <p className="blog-section-subtitle">Discover the impactful work we're doing in communities</p>
            <div className="blog-grid">
              {homeProjects.map(project => (
                <article key={project.id} className="blog-card" onClick={() => navigate(`/projects`)}>
                  {project.images && project.images.length > 0 && (
                    <div className="blog-card-image">
                      <img src={project.images[0]} alt={project.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <h3 className="blog-card-title-only">{project.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      {project.description.substring(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span className="role-badge" style={{ fontSize: '0.8rem' }}>
                        {project.category}
                      </span>
                      <span className="role-badge" style={{ fontSize: '0.8rem', backgroundColor: project.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                        {project.status}
                      </span>
                    </div>
                    <Link to="/projects" className="blog-read-more-btn" onClick={(e) => e.stopPropagation()}>
                      View All Projects
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="blog-section">
          <div className="container">
            <h2>Latest News & Updates</h2>
            <p className="blog-section-subtitle">Stay updated with our latest activities and news</p>
            <div className="blog-grid">
              {blogPosts.map(post => (
                <article key={post.id} className="blog-card" onClick={() => navigate(`/blog/${post.id}`)}>
                  {post.featured_image && (
                    <div className="blog-card-image">
                      <img src={post.featured_image} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <h3 className="blog-card-title-only">{post.title}</h3>
                    <Link to={`/blog/${post.id}`} className="blog-read-more-btn" onClick={(e) => e.stopPropagation()}>
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            {blogPosts.length >= 3 && (
              <div className="blog-section-cta">
                <Link to="/blog" className="btn btn-primary">View All Blog Posts</Link>
              </div>
            )}
          </div>
        </section>
      )}

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



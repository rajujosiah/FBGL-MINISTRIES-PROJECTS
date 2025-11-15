import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProjects } from '../utils/supabase';
import { sampleProjects } from '../utils/sampleData';
import './Projects.css';

const Projects = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [loading, setLoading] = useState(true);
  const [useSampleData, setUseSampleData] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [selectedCategory, projects]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      if (data) {
        setProjects(data);
        setUseSampleData(false);
      } else {
        setProjects(sampleProjects);
        setUseSampleData(true);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects(sampleProjects);
      setUseSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(p => 
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'ongoing': '#28a745',
      'completed': '#6c757d',
      'upcoming': '#ffc107'
    };
    
    const color = statusColors[status?.toLowerCase()] || '#6c757d';
    
    return (
      <span className="status-badge" style={{ backgroundColor: color }}>
        {status || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="container">
          <div className="loading">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="container">
        <h1>Our Projects</h1>
        <p className="projects-subtitle">
          Transforming communities through Social, Economic & Educational empowerment
        </p>

        {/* Category Filter */}
        <div className="category-filter">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''} 
            onClick={() => setSelectedCategory('all')}
          >
            All Projects
          </button>
          <button 
            className={selectedCategory === 'social' ? 'active' : ''} 
            onClick={() => setSelectedCategory('social')}
          >
            Social
          </button>
          <button 
            className={selectedCategory === 'economy' ? 'active' : ''} 
            onClick={() => setSelectedCategory('economy')}
          >
            Economy
          </button>
          <button 
            className={selectedCategory === 'education' ? 'active' : ''} 
            onClick={() => setSelectedCategory('education')}
          >
            Education
          </button>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  {project.images && project.images.length > 0 ? (
                    <img 
                      src={project.images[0] || 'https://via.placeholder.com/400x250?text=' + project.title} 
                      alt={project.title} 
                    />
                  ) : (
                    <div className="placeholder-image">
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                  {getStatusBadge(project.status)}
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-details">
                    {project.area_of_operation && (
                      <div className="project-detail-item">
                        <strong>📍 Area:</strong> {project.area_of_operation}
                      </div>
                    )}
                    {project.location && (
                      <div className="project-detail-item">
                        <strong>📍 Location:</strong> {project.location}
                      </div>
                    )}
                    {project.target_beneficiaries && (
                      <div className="project-detail-item">
                        <strong>👥 Beneficiaries:</strong> {project.target_beneficiaries}
                      </div>
                    )}
                  </div>
                  <div className="project-actions">
                    <button className="btn-view-details">View Details</button>
                    <Link to="/donate" className="btn-support">Support Project</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;



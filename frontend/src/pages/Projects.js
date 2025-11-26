import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProjects, initializeData, getSiteSettings } from '../utils/dataManager';
import { IoMdMap, IoMdPeople } from 'react-icons/io';
import './Projects.css';

const Projects = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [selectedCategory, projects]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      await initializeData();
      await initializeData();
      const [allProjects, settings] = await Promise.all([
        getProjects({}),
        getSiteSettings()
      ]);

      const showAll = settings?.show_all_projects_on_home;
      let projectsToShow = [];

      if (showAll) {
        projectsToShow = Array.isArray(allProjects) ? allProjects : [];
      } else {
        projectsToShow = Array.isArray(allProjects) ? allProjects.filter(p => p.show_on_home) : [];
      }

      setProjects(projectsToShow);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
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
              <div key={project.id} className="featured-card">
                <div className="featured-card-image">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                    />
                  ) : (
                    <div className="placeholder-image" style={{ fontSize: '2rem' }}>
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="featured-card-content">
                  <h3>{project.title}</h3>
                  <div className="featured-meta">
                    <span className="featured-badge">{project.category}</span>
                    <span className="featured-badge" style={{
                      backgroundColor: project.status === 'completed' ? '#d1fae5' : '#fef3c7',
                      color: project.status === 'completed' ? '#065f46' : '#92400e'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <p>{project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                  <Link to={`/projects/${project.id}`} className="btn-view-featured">
                    View Details
                  </Link>
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



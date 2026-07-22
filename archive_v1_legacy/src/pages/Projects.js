import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, PROJECT_CATEGORIES, PROJECT_STATUS } from '../services/supabaseClient';
import '../styles/pages/projects.css';
import { Calendar, MapPin, Users, Filter, Search, Eye } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, selectedStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      [PROJECT_CATEGORIES.SOCIAL]: 'Social Development',
      [PROJECT_CATEGORIES.ECONOMIC]: 'Economic Empowerment',
      [PROJECT_CATEGORIES.EDUCATIONAL]: 'Educational Support'
    };
    return categoryNames[category] || category;
  };

  const getStatusDisplayName = (status) => {
    const statusNames = {
      [PROJECT_STATUS.ONGOING]: 'Ongoing',
      [PROJECT_STATUS.COMPLETED]: 'Completed',
      [PROJECT_STATUS.UPCOMING]: 'Upcoming'
    };
    return statusNames[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      [PROJECT_STATUS.ONGOING]: 'bg-blue-100 text-blue-800',
      [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
      [PROJECT_STATUS.UPCOMING]: 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      [PROJECT_CATEGORIES.SOCIAL]: 'bg-red-100 text-red-800',
      [PROJECT_CATEGORIES.ECONOMIC]: 'bg-green-100 text-green-800',
      [PROJECT_CATEGORIES.EDUCATIONAL]: 'bg-blue-100 text-blue-800'
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="projects-loading-content">
          <div className="projects-loading-spinner"></div>
          <p className="projects-loading-text">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="projects-hero-overlay"></div>
        <div className="projects-hero-container">
          <div className="projects-hero-content">
            <div className="projects-hero-badge">
              <Calendar className="projects-hero-badge-icon" />
              <span className="projects-hero-badge-text">Our Projects</span>
            </div>
            <h1 className="projects-hero-title">
              Impactful
              <span className="projects-hero-title-accent">
                Projects
              </span>
            </h1>
            <p className="projects-hero-description">
              Discover the transformative projects we're working on across communities to create lasting positive change
            </p>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="projects-hero-bg projects-hero-bg-1"></div>
        <div className="projects-hero-bg projects-hero-bg-2"></div>
      </section>

      <div className="projects-content">
        {/* Filters */}
        <div className="projects-filters">
          <div className="projects-filters-grid">
            {/* Search */}
            <div className="projects-search">
              <Search className="projects-search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="projects-search-input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="projects-filter-select"
            >
              <option value="all">All Categories</option>
              <option value={PROJECT_CATEGORIES.SOCIAL}>Social Development</option>
              <option value={PROJECT_CATEGORIES.ECONOMIC}>Economic Empowerment</option>
              <option value={PROJECT_CATEGORIES.EDUCATIONAL}>Educational Support</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="projects-filter-select"
            >
              <option value="all">All Status</option>
              <option value={PROJECT_STATUS.ONGOING}>Ongoing</option>
              <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
              <option value={PROJECT_STATUS.UPCOMING}>Upcoming</option>
            </select>

            {/* Results Count */}
            <div className="projects-results">
              <Filter className="projects-results-icon" />
              <span className="projects-results-text">{filteredProjects.length} projects found</span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="projects-card">
              {/* Project Image */}
              <div className="projects-card-image">
                {project.images_base64 && project.images_base64.length > 0 ? (
                  <img
                    src={project.images_base64[0]}
                    alt={project.title}
                    className="projects-card-image-img"
                  />
                ) : (
                  <div className="projects-card-image-placeholder">
                    <Calendar className="projects-card-image-icon" />
                  </div>
                )}
                <div className="projects-card-badges">
                  <span className={`projects-card-badge ${getStatusColor(project.status)}`}>
                    {getStatusDisplayName(project.status)}
                  </span>
                  <span className={`projects-card-badge ${getCategoryColor(project.category)}`}>
                    {getCategoryDisplayName(project.category)}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="projects-card-content">
                <h3 className="projects-card-title">
                  {project.title}
                </h3>
                <p className="projects-card-description">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="projects-card-details">
                  {project.location && (
                    <div className="projects-card-detail">
                      <MapPin className="projects-card-detail-icon" />
                      <span className="projects-card-detail-text">{project.location}</span>
                    </div>
                  )}
                  {project.target_beneficiaries && (
                    <div className="projects-card-detail">
                      <Users className="projects-card-detail-icon" />
                      <span className="projects-card-detail-text">{project.target_beneficiaries} beneficiaries</span>
                    </div>
                  )}
                  <div className="projects-card-detail">
                    <Calendar className="projects-card-detail-icon" />
                    <span className="projects-card-detail-text">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="projects-card-btn"
                >
                  <Eye className="projects-card-btn-icon" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <div className="projects-empty-icon">
              <Filter className="projects-empty-icon-svg" />
            </div>
            <h3 className="projects-empty-title">No projects found</h3>
            <p className="projects-empty-description">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="projects-modal">
            <div className="projects-modal-content">
              <div className="projects-modal-header">
                <div className="projects-modal-badges">
                  <span className={`projects-modal-badge ${getCategoryColor(selectedProject.category)}`}>
                    {getCategoryDisplayName(selectedProject.category)}
                  </span>
                  <span className={`projects-modal-badge ${getStatusColor(selectedProject.status)}`}>
                    {getStatusDisplayName(selectedProject.status)}
                  </span>
                </div>
                <h2 className="projects-modal-title">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="projects-modal-close"
                >
                  ×
                </button>
              </div>

              {/* Project Images */}
              {selectedProject.images_base64 && selectedProject.images_base64.length > 0 && (
                <div className="projects-modal-images">
                  <div className="projects-modal-images-grid">
                    {selectedProject.images_base64.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProject.title} - Image ${index + 1}`}
                        className="projects-modal-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="projects-modal-details">
                <div className="projects-modal-description">
                  <h3 className="projects-modal-description-title">Description</h3>
                  <p className="projects-modal-description-text">{selectedProject.description}</p>
                </div>

                <div className="projects-modal-info">
                  {selectedProject.location && (
                    <div className="projects-modal-info-item">
                      <h4 className="projects-modal-info-label">Location</h4>
                      <p className="projects-modal-info-value">{selectedProject.location}</p>
                    </div>
                  )}

                  {selectedProject.area_of_operation && (
                    <div className="projects-modal-info-item">
                      <h4 className="projects-modal-info-label">Area of Operation</h4>
                      <p className="projects-modal-info-value">{selectedProject.area_of_operation}</p>
                    </div>
                  )}

                  {selectedProject.target_beneficiaries && (
                    <div className="projects-modal-info-item">
                      <h4 className="projects-modal-info-label">Target Beneficiaries</h4>
                      <p className="projects-modal-info-value">{selectedProject.target_beneficiaries}</p>
                    </div>
                  )}

                  <div className="projects-modal-info-item">
                    <h4 className="projects-modal-info-label">Created</h4>
                    <p className="projects-modal-info-value">{new Date(selectedProject.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="projects-modal-actions">
                <Link
                  to="/donate"
                  className="projects-modal-btn projects-modal-btn-primary"
                >
                  Support This Project
                </Link>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="projects-modal-btn projects-modal-btn-secondary"
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

export default Projects;

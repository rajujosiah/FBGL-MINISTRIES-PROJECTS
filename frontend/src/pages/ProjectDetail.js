
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getProjectById,
    getAreaManagerById,
    getProjectManagerById,
    getSocialWorkerById,
    updateProject,
    addProjectImages
} from '../utils/dataManager';
import { validateImageFile, compressImage } from '../utils/imageUtils';
import {
    IoMdArrowBack,
    IoMdMap,
    IoMdPeople,
    IoMdCalendar,
    IoMdArrowDropleft,
    IoMdArrowDropright,
    IoMdCamera,
    IoMdCheckmarkCircle,
    IoMdTime,
    IoMdRefresh
} from 'react-icons/io';
import './ProjectDetail.css';

// Helper function to normalize ID numbers for URLs (remove spaces, uppercase)
const normalizeIdNo = (idNo) => {
    if (!idNo) return '';
    return idNo.replace(/\s+/g, '').toUpperCase();
};

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [areaManager, setAreaManager] = useState(null);
    const [projectManager, setProjectManager] = useState(null);
    const [socialWorker, setSocialWorker] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Check if current user is authorized to edit this project
    const canEdit = user && (
        user.role === 'admin' ||
        (user.role === 'social_worker' && project?.social_worker_id && user.id_no && socialWorker?.id_no === user.id_no) ||
        (user.role === 'social_worker' && user.username === 'socialworker')
    );

    useEffect(() => {
        loadProjectDetails();
    }, [id]);

    const loadProjectDetails = async () => {
        setLoading(true);
        try {
            const data = await getProjectById(id);
            if (data) {
                setProject(data);

                // Load related personnel if IDs exist
                if (data.area_manager_id) {
                    const am = await getAreaManagerById(data.area_manager_id);
                    setAreaManager(am);
                }
                if (data.project_manager_id) {
                    const pm = await getProjectManagerById(data.project_manager_id);
                    setProjectManager(pm);
                }
                if (data.social_worker_id) {
                    const sw = await getSocialWorkerById(data.social_worker_id);
                    setSocialWorker(sw);
                }
            }
        } catch (error) {
            console.error("Failed to load project details:", error);
            setProject(null); // Indicate that project couldn't be loaded
        } finally {
            setLoading(false);
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

    const nextImage = () => {
        if (project?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
        }
    };

    const prevImage = () => {
        if (project?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!project || !canEdit) return;
        try {
            await updateProject(project.id, { status: newStatus });
            setProject(prev => ({ ...prev, status: newStatus }));
            alert('Project status updated successfully!');
        } catch (error) {
            console.error('Error updating project status:', error);
            alert('Failed to update project status.');
        }
    };

    const handleImageUpload = async (event) => {
        if (!project || !canEdit) return;

        const files = Array.from(event.target.files);
        if (!files.length) return;

        setUploading(true);
        try {
            const validFiles = files.filter(file => {
                const isValid = validateImageFile(file);
                if (!isValid) {
                    alert(`Invalid file type or size for ${file.name}. Please upload images (jpg, jpeg, png, gif) under 5MB.`);
                }
                return isValid;
            });

            if (validFiles.length === 0) {
                setUploading(false);
                return;
            }

            const compressedImages = await Promise.all(
                validFiles.map(file => compressImage(file))
            );

            const imageUrls = await addProjectImages(project.id, compressedImages);
            setProject(prev => ({
                ...prev,
                images: [...(prev?.images || []), ...imageUrls]
            }));
            alert(`${imageUrls.length} image(s) uploaded successfully!`);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images.');
        } finally {
            setUploading(false);
            event.target.value = null; // Clear the input
        }
    };

    if (loading) {
        return (
            <div className="project-detail-page">
                <div className="container">
                    <div className="loading">Loading project details...</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-detail-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Project not found</h2>
                        <Link to="/projects" className="btn-secondary">Back to Projects</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/projects')}>
                    <IoMdArrowBack /> Back to Projects
                </button>

                {/* Image Carousel */}
                <div className="carousel-container">
                    {project.images && project.images.length > 0 ? (
                        <>
                            <div className="carousel-slide">
                                <img
                                    src={project.images[currentImageIndex]}
                                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                />
                                {getStatusBadge(project.status)}
                            </div>

                            {project.images.length > 1 && (
                                <>
                                    <button className="carousel-control prev" onClick={prevImage}>
                                        <IoMdArrowDropleft />
                                    </button>
                                    <button className="carousel-control next" onClick={nextImage}>
                                        <IoMdArrowDropright />
                                    </button>
                                    <div className="carousel-indicators">
                                        {project.images.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="carousel-placeholder">
                            <span>{project.title.charAt(0)}</span>
                            {getStatusBadge(project.status)}
                        </div>
                    )}
                </div>

                <div className="project-content-layout">
                    <div className="project-main-info">
                        <div className="project-header">
                            <span className={`category-tag ${project.category?.toLowerCase()}`}>
                                {project.category}
                            </span>
                            <h1>{project.title}</h1>
                            <div className="meta-info">
                                {project.location && (
                                    <span className="meta-item">
                                        <IoMdMap /> {project.location}
                                    </span>
                                )}
                                <span className="meta-item">
                                    <IoMdCalendar /> {new Date(project.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {canEdit && (
                            <div className="management-section">
                                <h2>Manage Project</h2>
                                <div className="management-controls">
                                    <div className="status-controls">
                                        <h3>Update Status</h3>
                                        <div className="status-buttons">
                                            <button
                                                className={`btn-status ${project.status === 'upcoming' ? 'active' : ''}`}
                                                onClick={() => handleStatusUpdate('upcoming')}
                                                disabled={project.status === 'upcoming'}
                                            >
                                                <IoMdTime /> Upcoming
                                            </button>
                                            <button
                                                className={`btn-status ${project.status === 'ongoing' ? 'active' : ''}`}
                                                onClick={() => handleStatusUpdate('ongoing')}
                                                disabled={project.status === 'ongoing'}
                                            >
                                                <IoMdRefresh /> Ongoing
                                            </button>
                                            <button
                                                className={`btn-status ${project.status === 'completed' ? 'active' : ''}`}
                                                onClick={() => handleStatusUpdate('completed')}
                                                disabled={project.status === 'completed'}
                                            >
                                                <IoMdCheckmarkCircle /> Completed
                                            </button>
                                        </div>
                                    </div>

                                    <div className="upload-controls">
                                        <h3>Add Photos</h3>
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                id="detail-image-upload"
                                                className="file-input"
                                            />
                                            <label htmlFor="detail-image-upload" className="btn-primary">
                                                {uploading ? 'Uploading...' : <><IoMdCamera /> Upload Images</>}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="project-description-section">
                            <h2>About the Project</h2>
                            <p>{project.description}</p>
                        </div>

                        <div className="project-highlights">
                            {project.area_of_operation && (
                                <div className="highlight-item">
                                    <h3>Area of Operation</h3>
                                    <p>{project.area_of_operation}</p>
                                </div>
                            )}
                            {project.target_beneficiaries && (
                                <div className="highlight-item">
                                    <h3>Target Beneficiaries</h3>
                                    <p>{project.target_beneficiaries}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="project-sidebar">
                        <div className="sidebar-card team-card">
                            <h3>Project Team</h3>

                            {areaManager && (
                                <div className="team-member-item">
                                    <div className="role-label">Area Manager</div>
                                    <Link to={`/team/area_manager/${encodeURIComponent(normalizeIdNo(areaManager.id_no))}`} className="member-link">
                                        {areaManager.name}
                                    </Link>
                                </div>
                            )}

                            {projectManager && (
                                <div className="team-member-item">
                                    <div className="role-label">Project Manager</div>
                                    <Link to={`/team/project_manager/${encodeURIComponent(normalizeIdNo(projectManager.id_no))}`} className="member-link">
                                        {projectManager.name}
                                    </Link>
                                </div>
                            )}

                            {socialWorker && (
                                <div className="team-member-item">
                                    <div className="role-label">Social Worker</div>
                                    <Link to={`/team/social_worker/${encodeURIComponent(normalizeIdNo(socialWorker.id_no))}`} className="member-link">
                                        {socialWorker.name}
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-card action-card">
                            <h3>Support This Project</h3>
                            <p>Your contribution can make a real difference in the lives of these beneficiaries.</p>
                            <Link to="/donate" className="btn-primary full-width">Donate Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAreaManagers, getProjectManagers, getSocialWorkers, getProfileById, getProfileByIdNo, getProjects } from '../utils/supabase';
import { getBoardMembers } from '../utils/dataManager';

import IDCard from '../components/IDCard';
import html2canvas from 'html2canvas';
import { IoMdCard, IoMdMap, IoMdPeople } from 'react-icons/io';
import './OurTeam.css';

// Helper function to normalize ID numbers for URLs (remove spaces, uppercase)
const normalizeIdNo = (idNo) => {
  if (!idNo) return '';
  return idNo.replace(/\s+/g, '').toUpperCase();
};



const OurTeam = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [activeTab, setActiveTab] = useState(type || 'board');
  const [areaManagers, setAreaManagers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [selectedAreaManager, setSelectedAreaManager] = useState(null);
  const [selectedProjectManager, setSelectedProjectManager] = useState(null);
  const [selectedSocialWorker, setSelectedSocialWorker] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIDCard, setShowIDCard] = useState(false);
  const [idCardUser, setIdCardUser] = useState(null);
  const [idCardRole, setIdCardRole] = useState(null);
  const [selectedBoardMember, setSelectedBoardMember] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reset view when visiting /team without params
    if (!type && !id) {
      setSelectedAreaManager(null);
      setSelectedProjectManager(null);
      setSelectedSocialWorker(null);
      setProjectManagers([]);
      setSocialWorkers([]);
      setProjects([]);
      setActiveTab('board');
    }
  }, [type, id]);

  useEffect(() => {
    if (type && id && !loading) {
      // Check if we are already viewing this profile to avoid loops
      const currentIdNo =
        (type === 'area_manager' && selectedAreaManager) ? normalizeIdNo(selectedAreaManager.id_no) :
          (type === 'project_manager' && selectedProjectManager) ? normalizeIdNo(selectedProjectManager.id_no) :
            (type === 'social_worker' && selectedSocialWorker) ? normalizeIdNo(selectedSocialWorker.id_no) : null;

      // Only load if we're not already viewing this profile
      if (currentIdNo !== id) {
        handleViewProfile(type, id);
      }
    }
  }, [type, id, loading, selectedAreaManager, selectedProjectManager, selectedSocialWorker]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase
      const [am, bm] = await Promise.all([
        getAreaManagers(),
        getBoardMembers()
      ]);

      if (am && bm) {
        setAreaManagers(am);
        setBoardMembers(bm);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaManagerClick = async (managerIdOrIdNo) => {
    setLoading(true);
    try {
      const profile = await getProfileByIdNo('area_manager', managerIdOrIdNo) || await getProfileById('area_manager', parseInt(managerIdOrIdNo));

      if (!profile) {
        console.error('Area manager not found');
        navigate('/team');
        return;
      }

      setSelectedAreaManager(profile);

      // Load project managers for this area manager
      const pms = await getProjectManagers(profile.id);

      setProjectManagers(pms || []);

      // Load all projects for counting
      const allProjects = await getProjects({});
      setProjects(allProjects || []);
      // Load social workers for all project managers
      const allSws = [];
      for (const pm of (pms || [])) {
        const sws = await getSocialWorkers(pm.id);
        if (sws) allSws.push(...sws);
      }
      setSocialWorkers(allSws);

      setSelectedProjectManager(null);
      setSelectedSocialWorker(null);
      setActiveTab('area_manager');
      const idNo = normalizeIdNo(profile.id_no);
      navigate(`/team/area_manager/${encodeURIComponent(idNo)}`);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading area manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectManagerClick = async (managerIdOrIdNo) => {
    // Use the function that loads parents if coming from direct URL
    if (!selectedAreaManager) {
      await handleProjectManagerClickWithParent(managerIdOrIdNo);
    } else {
      setLoading(true);
      try {
        const profile = await getProfileByIdNo('project_manager', managerIdOrIdNo) || await getProfileById('project_manager', parseInt(managerIdOrIdNo));

        if (!profile) {
          console.error('Project manager not found');
          return;
        }

        setSelectedProjectManager(profile);

        // Load social workers for this project manager
        const sws = await getSocialWorkers(profile.id);

        setSocialWorkers(sws || []);

        // Load all projects for accurate project count
        const allProjects = await getProjects({});
        setProjects(allProjects || []);

        setSelectedSocialWorker(null);
        setActiveTab('project_manager');
        const idNo = normalizeIdNo(profile.id_no);
        navigate(`/team/project_manager/${encodeURIComponent(idNo)}`);
      } catch (error) {
        console.error('Error loading project manager:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProjectManagerClickWithParent = async (managerIdOrIdNo) => {
    setLoading(true);
    try {
      const profile = await getProfileByIdNo('project_manager', managerIdOrIdNo) || await getProfileById('project_manager', parseInt(managerIdOrIdNo));

      if (!profile) {
        console.error('Project manager not found');
        navigate('/team');
        return;
      }

      setSelectedProjectManager(profile);

      // Load parent area manager
      const areaManagerId = profile.area_manager_id;
      if (areaManagerId) {
        const areaManager = await getProfileById('area_manager', areaManagerId);

        if (areaManager) {
          setSelectedAreaManager(areaManager);
          profile.reporting_to = areaManager.name;
          // Load all project managers for this area manager
          const pms = await getProjectManagers(areaManagerId);
          setProjectManagers(pms || []);
        }
      }

      // Load social workers for this project manager
      const sws = await getSocialWorkers(profile.id);

      setSocialWorkers(sws || []);

      // Load all projects for accurate project count
      const allProjects = await getProjects({});
      setProjects(allProjects || []);

      setSelectedSocialWorker(null);
      setActiveTab('project_manager');
      const idNo = normalizeIdNo(profile.id_no);
      navigate(`/team/project_manager/${encodeURIComponent(idNo)}`);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading project manager:', error);
      navigate('/team');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialWorkerClickWithParents = async (workerIdOrIdNo) => {
    setLoading(true);
    try {
      const profile = await getProfileByIdNo('social_worker', workerIdOrIdNo) || await getProfileById('social_worker', parseInt(workerIdOrIdNo));

      if (!profile) {
        console.error('Social worker not found');
        navigate('/team');
        return;
      }

      // Load parent project manager
      const projectManagerId = profile.project_manager_id;
      if (projectManagerId) {
        const projectManager = await getProfileById('project_manager', projectManagerId);

        if (projectManager) {
          setSelectedProjectManager(projectManager);
          profile.reporting_to = projectManager.name;

          // Load parent area manager
          const areaManagerId = projectManager.area_manager_id;
          if (areaManagerId) {
            const areaManager = await getProfileById('area_manager', areaManagerId);

            if (areaManager) {
              setSelectedAreaManager(areaManager);
              // Load all project managers for this area manager
              const pms = await getProjectManagers(areaManagerId);
              setProjectManagers(pms || []);
            }
          }

          // Load all social workers for this project manager
          const sws = await getSocialWorkers(projectManagerId);
          setSocialWorkers(sws || []);
        }
      }

      setSelectedSocialWorker(profile);

      // Load projects for this social worker
      const proj = await getProjects({ socialWorkerId: profile.id });

      setProjects(proj || []);
      setActiveTab('social_worker');
      const idNo = normalizeIdNo(profile.id_no);
      navigate(`/team/social_worker/${encodeURIComponent(idNo)}`);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading social worker:', error);
      navigate('/team');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialWorkerClick = async (workerIdOrIdNo) => {
    // Use the function that loads parents if coming from direct URL
    if (!selectedProjectManager) {
      await handleSocialWorkerClickWithParents(workerIdOrIdNo);
    } else {
      setLoading(true);
      try {
        const profile = await getProfileByIdNo('social_worker', workerIdOrIdNo) || await getProfileById('social_worker', parseInt(workerIdOrIdNo));

        if (!profile) {
          console.error('Social worker not found');
          return;
        }

        // If we have a project manager selected, include their info
        if (selectedProjectManager) {
          profile.reporting_to = selectedProjectManager.name;
        }

        setSelectedSocialWorker(profile);

        // Load projects for this social worker
        const proj = await getProjects({ socialWorkerId: profile.id });

        setProjects(proj || []);
        setActiveTab('social_worker');
        const idNo = normalizeIdNo(profile.id_no);
        navigate(`/team/social_worker/${encodeURIComponent(idNo)}`);

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error loading social worker:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewProfile = async (profileType, profileIdOrIdNo) => {
    // Decode URL component if needed
    const decodedId = decodeURIComponent(profileIdOrIdNo);

    // Wait for initial data to load if not already loaded
    if (areaManagers.length === 0) {
      await loadData();
    }

    if (profileType === 'area_manager') {
      await handleAreaManagerClick(decodedId);
    } else if (profileType === 'project_manager') {
      // Need to load parent area manager first
      await handleProjectManagerClickWithParent(decodedId);
    } else if (profileType === 'social_worker') {
      // Need to load parent project manager and area manager first
      await handleSocialWorkerClickWithParents(decodedId);
    }
  };

  const handleBack = () => {
    if (selectedSocialWorker && selectedProjectManager) {
      setSelectedSocialWorker(null);
      setProjects([]);
      const idNo = normalizeIdNo(selectedProjectManager.id_no);
      navigate(`/team/project_manager/${encodeURIComponent(idNo)}`);
    } else if (selectedProjectManager && selectedAreaManager) {
      setSelectedProjectManager(null);
      setSocialWorkers([]);
      const idNo = normalizeIdNo(selectedAreaManager.id_no);
      navigate(`/team/area_manager/${encodeURIComponent(idNo)}`);
    } else if (selectedAreaManager) {
      setSelectedAreaManager(null);
      setProjectManagers([]);
      navigate('/team');
    } else {
      navigate('/team');
    }
  };

  const handleBoardMemberClick = (member) => {
    setSelectedBoardMember(member);
  };

  const renderProfileCard = (person, onClick) => {
    // Generate a deterministic portrait ID based on name hash
    const getPortraitId = (name) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash) % 99;
    };
    const isFemale = person.name.toLowerCase().includes('mrs.') ||
      person.name.toLowerCase().includes('sarah') ||
      person.name.toLowerCase().includes('jane') ||
      person.name.toLowerCase().includes('mary') ||
      person.name.toLowerCase().includes('emma') ||
      person.name.toLowerCase().includes('lisa');
    const profilePic = person.profile_picture || `https://randomuser.me/api/portraits/${isFemale ? 'women' : 'men'}/${getPortraitId(person.name)}.jpg`;

    // Use id_no for navigation
    const handleClick = () => {
      if (onClick) {
        const idNo = normalizeIdNo(person.id_no);
        onClick(idNo);
      }
    };

    return (
      <div key={person.id} className="profile-card" onClick={handleClick}>
        <div className="profile-photo">
          <img src={profilePic} alt={person.name} />
        </div>
        <div className="profile-info">
          <h3>{person.name}</h3>
          {person.id_no && <p className="profile-id">{normalizeIdNo(person.id_no)}</p>}
          <p className="profile-role">{person.position || person.area_manager || 'Member'}</p>
          {person.bio && (
            <p className="profile-bio">{person.bio.substring(0, 100)}...</p>
          )}
        </div>
      </div>
    );
  };

  const renderProfileDetail = (profile, profileType) => {
    if (!profile) return null;

    // Generate a deterministic portrait ID based on name hash
    const getPortraitId = (name) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash) % 99;
    };
    const isFemale = profile.name.toLowerCase().includes('mrs.') ||
      profile.name.toLowerCase().includes('sarah') ||
      profile.name.toLowerCase().includes('jane') ||
      profile.name.toLowerCase().includes('mary') ||
      profile.name.toLowerCase().includes('emma') ||
      profile.name.toLowerCase().includes('lisa');
    const profilePic = profile.profile_picture || `https://randomuser.me/api/portraits/${isFemale ? 'women' : 'men'}/${getPortraitId(profile.name)}.jpg`;

    // Get role title based on profile type
    const getRoleTitle = () => {
      switch (profileType) {
        case 'area_manager':
          return 'Area Manager';
        case 'project_manager':
          return 'Project Manager';
        case 'social_worker':
          return 'Social Worker';
        case 'board_member':
          return profile.position || 'Board Member';
        default:
          return 'Member';
      }
    };

    // Helper function to count projects for project manager
    const countProjectsForProjectManager = () => {
      if (profileType !== 'project_manager') return 0;
      // Use the loaded projects state which should contain all projects for this project manager's social workers
      const workerIds = socialWorkers.map(sw => sw.id);
      return projects.filter(p => p.social_worker_id && workerIds.includes(p.social_worker_id)).length;
    };

    // Helper function to count projects for area manager
    const countProjectsForAreaManager = () => {
      if (profileType !== 'area_manager') return 0;
      // Use the loaded projects state which should contain all projects for this area manager's hierarchy
      // Get all social worker IDs under all project managers of this area manager
      const workerIds = socialWorkers.map(sw => sw.id);
      return projects.filter(p => p.social_worker_id && workerIds.includes(p.social_worker_id)).length;
    };

    // Get total count based on profile type
    const getTotalCount = () => {
      if (profileType === 'area_manager') {
        return projectManagers.length;
      } else if (profileType === 'project_manager') {
        return socialWorkers.length;
      } else if (profileType === 'social_worker') {
        return projects.length;
      }
      return 0;
    };

    const getProjectCount = () => {
      if (profileType === 'area_manager') {
        return countProjectsForAreaManager();
      } else if (profileType === 'project_manager') {
        return countProjectsForProjectManager();
      }
      return 0;
    };

    const getCountLabel = () => {
      if (profileType === 'area_manager') {
        return 'Total Project Managers';
      } else if (profileType === 'project_manager') {
        return 'Total Social Workers';
      } else if (profileType === 'social_worker') {
        return 'Total Projects';
      }
      return '';
    };

    return (
      <div className="profile-detail">
        <div className="profile-detail-header">
          <button className="back-button" onClick={handleBack}>← Back</button>
          <button
            className="id-card-button"
            onClick={(e) => {
              e.stopPropagation();
              setIdCardUser(profile);
              setIdCardRole(profileType);
              setShowIDCard(true);
            }}
          >
            <IoMdCard style={{ marginRight: '0.5rem' }} /> View ID Card
          </button>
        </div>
        <div className="profile-detail-photo">
          <img src={profilePic} alt={profile.name} />
        </div>
        <div className="profile-detail-info">
          <h2>{profile.name}</h2>
          <p className="profile-role-title">{getRoleTitle()}</p>
          {profile.id_no && <p className="profile-id-large">{profile.id_no}</p>}
          <div className="profile-details-grid">
            {(profileType === 'area_manager' || profileType === 'project_manager' || profileType === 'social_worker') && (
              <>
                <div className="count-badge">
                  <strong>{getCountLabel()}:</strong> <span className="count-number">{getTotalCount()}</span>
                </div>
                {(profileType === 'area_manager' || profileType === 'project_manager') && (
                  <div className="count-badge">
                    <strong>Total Projects Done:</strong> <span className="count-number">{getProjectCount()}</span>
                  </div>
                )}
              </>
            )}
            {profile.area_manager && <div><strong>Area Manager:</strong> {profile.area_manager}</div>}
            {profile.reporting_to && profileType === 'social_worker' && <div><strong>Reports To (Project Manager):</strong> {profile.reporting_to}</div>}
            {profile.reporting_to && profileType === 'project_manager' && <div><strong>Reports To (Area Manager):</strong> {profile.reporting_to}</div>}
            {profile.position && profileType !== 'board_member' && <div><strong>Position:</strong> {profile.position}</div>}
            {profile.state && <div><strong>State:</strong> {profile.state}</div>}
            {profile.district && <div><strong>District:</strong> {profile.district}</div>}
            {profile.address && <div><strong>Address:</strong> {profile.address}</div>}
            {profile.phone && <div><strong>Phone:</strong> <a href={`tel:${profile.phone}`}>{profile.phone}</a></div>}
            {profile.email && <div><strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a></div>}
            {profile.aadhaar_no && <div><strong>Aadhaar No:</strong> {profile.aadhaar_no}</div>}
            {profile.bio && (
              <div className="bio-section">
                <strong>Bio:</strong>
                <p>{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !selectedAreaManager && !selectedProjectManager && !selectedSocialWorker) {
    return (
      <div className="team-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      {showIDCard && idCardUser && (
        <div className="modal-overlay" onClick={() => { setShowIDCard(false); setIdCardUser(null); setIdCardRole(null); }}>
          <div className="modal-content id-card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ID Card</h3>
              <button className="close-btn" onClick={() => { setShowIDCard(false); setIdCardUser(null); setIdCardRole(null); }}>×</button>
            </div>
            <IDCard user={idCardUser} role={idCardRole} />
          </div>
        </div>
      )}

      {selectedBoardMember && (
        <div className="modal-overlay" onClick={() => setSelectedBoardMember(null)}>
          <div className="modal-content board-member-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Board Member Details</h3>
              <button className="close-btn" onClick={() => setSelectedBoardMember(null)}>×</button>
            </div>
            <div className="board-member-detail">
              <div className="board-member-photo-large">
                {selectedBoardMember.profile_picture ? (
                  <img src={selectedBoardMember.profile_picture} alt={selectedBoardMember.name} />
                ) : (
                  <div className="placeholder-photo-large">
                    {selectedBoardMember.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="board-member-info-large">
                <h2>{selectedBoardMember.name}</h2>
                <p className="board-role-large">{selectedBoardMember.position}</p>
                {selectedBoardMember.bio && (
                  <div className="board-bio-scroll">
                    <p>{selectedBoardMember.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <h1>Our Team</h1>

        {/* Show profile detail if viewing one */}
        {selectedSocialWorker && (
          <div className="profile-side-layout">
            <div className="profile-side-left">
              {renderProfileDetail(selectedSocialWorker, 'social_worker')}
            </div>
            <div className="profile-side-right">
              <div className="team-section">
                <h2>Projects Assigned to {selectedSocialWorker.name} <span className="count-badge-header">(Total: {projects.length})</span></h2>
                {projects.length > 0 ? (
                  <div className="projects-grid-compact">
                    {projects.map(project => (
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
                          <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                            {project.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="project-content">
                          <h3>{project.title}</h3>
                          <p className="project-description">{project.description}</p>
                          <div className="project-details">
                            {project.area_of_operation && (
                              <div className="project-detail-item">
                                <strong><IoMdMap style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Area:</strong> {project.area_of_operation}
                              </div>
                            )}
                            {project.location && (
                              <div className="project-detail-item">
                                <strong><IoMdMap style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Location:</strong> {project.location}
                              </div>
                            )}
                            {project.target_beneficiaries && (
                              <div className="project-detail-item">
                                <strong><IoMdPeople style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Beneficiaries:</strong> {project.target_beneficiaries}
                              </div>
                            )}
                          </div>
                          <div className="project-actions">
                            <Link to={`/projects`} className="btn-view-details">View All Projects</Link>
                            <Link to="/donate" className="btn-support">Support Project</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-items">
                    <p>No projects assigned to this social worker yet.</p>
                    <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                      View All Projects
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!selectedSocialWorker && selectedProjectManager && (
          <div className="profile-side-layout">
            <div className="profile-side-left">
              {renderProfileDetail(selectedProjectManager, 'project_manager')}
            </div>
            <div className="profile-side-right">
              <div className="team-section">
                <h2>Social Workers <span className="count-badge-header">(Total: {socialWorkers.length})</span></h2>
                {socialWorkers.length > 0 ? (
                  <div className="profiles-grid-compact">
                    {socialWorkers.map(sw => renderProfileCard(sw, (idNo) => handleSocialWorkerClick(idNo)))}
                  </div>
                ) : (
                  <div className="no-items">
                    <p>No social workers assigned to this project manager yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!selectedProjectManager && !selectedSocialWorker && selectedAreaManager && (
          <div className="profile-side-layout">
            <div className="profile-side-left">
              {renderProfileDetail(selectedAreaManager, 'area_manager')}
            </div>
            <div className="profile-side-right">
              {projectManagers.length > 0 && (
                <div className="team-section">
                  <h2>Project Managers <span className="count-badge-header">(Total: {projectManagers.length})</span></h2>
                  <div className="profiles-grid-compact">
                    {projectManagers.map(pm => renderProfileCard(pm, (idNo) => handleProjectManagerClick(idNo)))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show team list if not viewing a profile */}
        {!selectedAreaManager && !selectedProjectManager && !selectedSocialWorker && (
          <>
            <div className="team-tabs">
              <button
                className={activeTab === 'board' ? 'active' : ''}
                onClick={() => setActiveTab('board')}
              >
                Board Members
              </button>
              <button
                className={activeTab === 'area_managers' ? 'active' : ''}
                onClick={() => setActiveTab('area_managers')}
              >
                Area Managers
              </button>
            </div>

            {activeTab === 'board' && (
              <div className="team-section">
                <h2>Board Members</h2>
                <div className="profiles-grid">
                  {boardMembers.map(bm => renderProfileCard(bm, () => handleBoardMemberClick(bm)))}
                </div>
              </div>
            )}

            {activeTab === 'area_managers' && (
              <div className="team-section">
                <h2>Area Managers</h2>
                <div className="profiles-grid">
                  {areaManagers.map(am => renderProfileCard(am, (idNo) => handleAreaManagerClick(idNo)))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OurTeam;

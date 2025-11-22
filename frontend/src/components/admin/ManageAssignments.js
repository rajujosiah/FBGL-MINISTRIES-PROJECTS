import React, { useState, useEffect } from 'react';
import { IoMdMap } from 'react-icons/io';
import {
  getAreaManagers,
  getProjectManagers,
  getSocialWorkers,
  assignProjectManagerToAreaManager,
  assignSocialWorkerToProjectManager,
  unassignProjectManager,
  unassignSocialWorker
} from '../../utils/dataManager';
import { INDIAN_STATES, getDistrictsForState } from '../../utils/stateDistricts';
import './AdminComponents.css';

const ManageAssignments = ({ onUpdate }) => {
  const [areaManagers, setAreaManagers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState('area-to-project');
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render trigger
  const [unassignPMConfirm, setUnassignPMConfirm] = useState(null);
  const [unassignSWConfirm, setUnassignSWConfirm] = useState(null);

  useEffect(() => {
    loadData();
  }, [refreshKey]);


  useEffect(() => {
    if (filterState) {
      const districts = getDistrictsForState(filterState);
      if (!districts.includes(filterDistrict)) {
        setFilterDistrict('');
      }
    } else {
      setFilterDistrict('');
    }
  }, [filterState, filterDistrict]);

  const loadData = async () => {
    const [areas, projects, workers] = await Promise.all([
      getAreaManagers(),
      getProjectManagers(),
      getSocialWorkers()
    ]);
    setAreaManagers(Array.isArray(areas) ? areas : []);
    setProjectManagers(Array.isArray(projects) ? projects : []);
    setSocialWorkers(Array.isArray(workers) ? workers : []);
  };

  // Filter unassigned members by state/district - ONLY show members matching the manager's State/District
  // AND ensure they are not already assigned to any other manager
  const getFilteredUnassignedProjectManagers = (areaManager) => {
    // Only show Project Managers that:
    // 1. Are NOT assigned to any Area Manager (area_manager_id is null/undefined)
    //    OR are currently assigned to this specific Area Manager (for editing)
    // 2. Match the Area Manager's State AND District

    if (!Array.isArray(projectManagers)) return [];
    if (!areaManager.state || !areaManager.district) {
      return []; // No suggestions if area manager doesn't have state/district
    }

    let filtered = projectManagers.filter(pm => {
      // If not assigned to anyone, or assigned to THIS area manager, include them
      const notAssigned = pm.area_manager_id === null || pm.area_manager_id === undefined;
      const assignedToThis = pm.area_manager_id === areaManager.id;

      // Only show if not assigned OR assigned to this manager
      return (notAssigned || assignedToThis);
    });

    // Strict filtering: Only show PMs with matching State AND District
    filtered = filtered.filter(pm =>
      pm.state === areaManager.state && pm.district === areaManager.district
    );

    return filtered;
  };

  const getFilteredUnassignedSocialWorkers = (projectManager) => {
    // Only show Social Workers that:
    // 1. Are NOT assigned to any Project Manager (project_manager_id is null/undefined)
    //    OR are currently assigned to this specific Project Manager (for editing)
    // 2. Match the Project Manager's State AND District

    if (!Array.isArray(socialWorkers)) return [];
    if (!projectManager.state || !projectManager.district) {
      return []; // No suggestions if project manager doesn't have state/district
    }

    let filtered = socialWorkers.filter(sw => {
      // If not assigned to anyone, or assigned to THIS project manager, include them
      const notAssigned = sw.project_manager_id === null || sw.project_manager_id === undefined;
      const assignedToThis = sw.project_manager_id === projectManager.id;

      // Only show if not assigned OR assigned to this manager
      return (notAssigned || assignedToThis);
    });

    // Strict filtering: Only show SWs with matching State AND District
    filtered = filtered.filter(sw =>
      sw.state === projectManager.state && sw.district === projectManager.district
    );

    return filtered;
  };

  // Get suggested leads based on state/district match (same as filtered now, but kept for consistency)
  const getSuggestedProjectManagers = (areaManager) => {
    // Only show truly unassigned PMs (not assigned to anyone)
    const unassigned = projectManagers.filter(pm => !pm.area_manager_id);

    // Find PMs with matching state/district
    return unassigned.filter(pm =>
      pm.state === areaManager.state && pm.district === areaManager.district
    );
  };

  const getSuggestedSocialWorkers = (projectManager) => {
    // Only show truly unassigned SWs (not assigned to anyone)
    const unassigned = socialWorkers.filter(sw => !sw.project_manager_id);

    // Find SWs with matching state/district
    return unassigned.filter(sw =>
      sw.state === projectManager.state && sw.district === projectManager.district
    );
  };

  // Get total unassigned counts (without filters - just total unassigned)
  const getTotalUnassignedProjectManagers = () => {
    if (!Array.isArray(projectManagers)) return 0;
    return projectManagers.filter(pm => pm.area_manager_id === null || pm.area_manager_id === undefined).length;
  };

  const getTotalUnassignedSocialWorkers = () => {
    if (!Array.isArray(socialWorkers)) return 0;
    return socialWorkers.filter(sw => sw.project_manager_id === null || sw.project_manager_id === undefined).length;
  };

  // Get count of unassigned members matching each manager's State/District
  const getMatchingUnassignedCount = (state, district, type) => {
    if (!state || !district) return 0;

    if (type === 'project_manager') {
      return projectManagers.filter(pm =>
        !pm.area_manager_id && pm.state === state && pm.district === district
      ).length;
    } else if (type === 'social_worker') {
      return socialWorkers.filter(sw =>
        !sw.project_manager_id && sw.state === state && sw.district === district
      ).length;
    }
    return 0;
  };

  // Get Project Managers who don't have a matching Area Manager for their State/District
  const getUnmatchedProjectManagers = () => {
    if (!Array.isArray(projectManagers) || !Array.isArray(areaManagers)) return [];

    return projectManagers.filter(pm => {
      // Only show unassigned PMs
      if (pm.area_manager_id) return false;

      // Check if there's an Area Manager with matching State AND District
      const hasMatchingAM = areaManagers.some(am =>
        am.state === pm.state && am.district === pm.district
      );

      // Return true if NO matching Area Manager found
      return !hasMatchingAM;
    });
  };

  // Get Social Workers who don't have a matching Project Manager for their State/District
  const getUnmatchedSocialWorkers = () => {
    if (!Array.isArray(socialWorkers) || !Array.isArray(projectManagers)) return [];

    return socialWorkers.filter(sw => {
      // Only show unassigned SWs
      if (sw.project_manager_id) return false;

      // Check if there's a Project Manager with matching State AND District
      const hasMatchingPM = projectManagers.some(pm =>
        pm.state === sw.state && pm.district === sw.district
      );

      // Return true if NO matching Project Manager found
      return !hasMatchingPM;
    });
  };

  const refreshData = async () => {
    // Force immediate data reload
    const [freshAreaManagers, freshProjectManagers, freshSocialWorkers] = await Promise.all([
      getAreaManagers(),
      getProjectManagers(),
      getSocialWorkers()
    ]);

    setAreaManagers(Array.isArray(freshAreaManagers) ? freshAreaManagers : []);
    setProjectManagers(Array.isArray(freshProjectManagers) ? freshProjectManagers : []);
    setSocialWorkers(Array.isArray(freshSocialWorkers) ? freshSocialWorkers : []);

    // Also trigger re-render with key
    setRefreshKey(prev => prev + 1);
    onUpdate?.(); // Update parent stats
  };

  const handleAssignProjectManager = async (projectManagerId, areaManagerId) => {
    await assignProjectManagerToAreaManager(projectManagerId, areaManagerId);
    await refreshData();
  };

  const handleAssignSocialWorker = async (socialWorkerId, projectManagerId) => {
    await assignSocialWorkerToProjectManager(socialWorkerId, projectManagerId);
    await refreshData();
  };

  const handleUnassignProjectManager = async (projectManagerId) => {
    setUnassignPMConfirm(projectManagerId);
  };

  const confirmUnassignPM = async () => {
    const id = unassignPMConfirm;
    setUnassignPMConfirm(null);
    await unassignProjectManager(id);
    await refreshData();
  };

  const cancelUnassignPM = () => {
    setUnassignPMConfirm(null);
  };

  const handleUnassignSocialWorker = async (socialWorkerId) => {
    setUnassignSWConfirm(socialWorkerId);
  };

  const confirmUnassignSW = async () => {
    const id = unassignSWConfirm;
    setUnassignSWConfirm(null);
    await unassignSocialWorker(id);
    await refreshData();
  };

  const cancelUnassignSW = () => {
    setUnassignSWConfirm(null);
  };

  return (
    <div className="manage-section">
      <div className="section-header">
        <h2>Manage Assignments</h2>
      </div>

      <div className="assignment-tabs">
        <button
          className={activeTab === 'area-to-project' ? 'active' : ''}
          onClick={() => setActiveTab('area-to-project')}
        >
          Area Manager → Project Manager
        </button>
        <button
          className={activeTab === 'project-to-social' ? 'active' : ''}
          onClick={() => setActiveTab('project-to-social')}
        >
          Project Manager → Social Worker
        </button>
      </div>

      {activeTab === 'area-to-project' && (
        <div className="assignment-section">
          <div className="assignment-header-box">
            <h3>Step 2: Assign Project Managers to Area Managers</h3>
            <p className="section-description">
              <strong>How it works:</strong> After assigning State/District to Area Managers, you can now assign Project Managers to work under each Area Manager.
              <br /><br />
              <strong>Important:</strong> When you assign a Project Manager to an Area Manager, they will automatically inherit the State and District from that Area Manager.
              <br /><br />
              <strong>Filter by State/District:</strong> Use the filters below to show only Project Managers matching specific State/District.
            </p>
          </div>

          {/* Info Box */}
          <div className="assignment-info-box">
            <p className="info-text">
              <strong><IoMdMap style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> State & District Based Assignment:</strong> Each Area Manager card below shows ONLY unassigned Project Managers that match their exact State and District.
              This ensures that team members only work within their assigned geographic area.
            </p>
            <div className="info-stats">
              <span className="stat-badge">
                Total Unassigned PMs: <strong>{getTotalUnassignedProjectManagers()}</strong>
              </span>
            </div>
          </div>

          <div className="assignment-grid">
            {areaManagers.filter(am => am.state && am.district).map(areaManager => (
              <div key={areaManager.id} className="assignment-card">
                <div className="assignment-card-header">
                  <h4>{areaManager.name}</h4>
                  <p className="assignment-location">{areaManager.state} - {areaManager.district}</p>
                </div>


                <div className="unassigned-list">
                  <h5>
                    Unassigned Project Managers (Matching: {areaManager.state} - {areaManager.district})
                    <span className="count-badge-small">({getFilteredUnassignedProjectManagers(areaManager).filter(pm => pm.area_manager_id === null || pm.area_manager_id === undefined).length})</span>
                  </h5>
                  {getFilteredUnassignedProjectManagers(areaManager).filter(pm => pm.area_manager_id === null || pm.area_manager_id === undefined).length > 0 ? (
                    getFilteredUnassignedProjectManagers(areaManager).filter(pm => pm.area_manager_id === null || pm.area_manager_id === undefined).map(pm => (
                      <div key={pm.id} className="assignment-item">
                        <div>
                          <span>{pm.name} ({pm.id_no})</span>
                          {pm.state && pm.district && (
                            <span className="location-tag">✓ {pm.state} - {pm.district}</span>
                          )}
                        </div>
                        <button
                          className="btn-small btn-primary"
                          onClick={() => handleAssignProjectManager(pm.id, areaManager.id)}
                        >
                          Assign
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-item-box">
                      <p className="empty-item">
                        No unassigned Project Managers found matching <strong>{areaManager.state} - {areaManager.district}</strong>
                      </p>
                      <p className="empty-item-hint">
                        Project Managers must have the same State and District as this Area Manager to be assigned.
                        Already assigned members will not appear in other sections.
                      </p>
                    </div>
                  )}
                </div>

                <div className="assigned-list">
                  <h5>Assigned Project Managers</h5>
                  {projectManagers.filter(pm => pm.area_manager_id === areaManager.id).map(pm => (
                    <div key={pm.id} className="assignment-item assigned">
                      <div>
                        <span>{pm.name} ({pm.id_no})</span>
                        {pm.state && pm.district && (
                          <span className="location-tag">✓ {pm.state} - {pm.district}</span>
                        )}
                      </div>
                      <div className="assigned-actions">
                        <span className="assigned-badge">✓ Assigned</span>
                        <button
                          className="btn-small btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignProjectManager(pm.id);
                          }}
                          title="Unassign this Project Manager"
                        >
                          Unassign
                        </button>
                      </div>
                    </div>
                  ))}
                  {projectManagers.filter(pm => pm.area_manager_id === areaManager.id).length === 0 && (
                    <p className="empty-item">No assigned Project Managers</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {areaManagers.filter(am => am.state && am.district).length === 0 && (
            <p className="empty-state">
              No Area Managers with assigned State/District. Please assign State/District to Area Managers first.
            </p>
          )}

          {/* Unmatched Project Managers Section */}
          {getUnmatchedProjectManagers().length > 0 && (
            <div className="unmatched-section">
              <div className="unmatched-header">
                <h3>⚠️ Unassigned Project Managers Without Matching Area Manager</h3>
                <p className="unmatched-description">
                  The following Project Managers cannot be assigned because there is no Area Manager with matching State/District.
                  <br />
                  <strong>Action Required:</strong> Create an Area Manager for their State/District, or update their State/District to match an existing Area Manager.
                </p>
              </div>
              <div className="unmatched-list">
                {getUnmatchedProjectManagers().map(pm => (
                  <div key={pm.id} className="unmatched-item">
                    <div className="unmatched-info">
                      <span className="unmatched-name">{pm.name} ({pm.id_no})</span>
                      <span className="unmatched-location">📍 {pm.state} - {pm.district}</span>
                    </div>
                    <span className="unmatched-badge">No Matching Area Manager</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'project-to-social' && (
        <div className="assignment-section">
          <div className="assignment-header-box">
            <h3>Step 3: Assign Social Workers to Project Managers</h3>
            <p className="section-description">
              <strong>How it works:</strong> After assigning Project Managers to Area Managers, you can now assign Social Workers to work under each Project Manager.
              <br /><br />
              <strong>Important:</strong> When you assign a Social Worker to a Project Manager, they will automatically inherit the State and District from that Project Manager.
              <br /><br />
              <strong>Filter by State/District:</strong> Use the filters below to show only Social Workers matching specific State/District.
            </p>
          </div>

          {/* Info Box */}
          <div className="assignment-info-box">
            <p className="info-text">
              <strong><IoMdMap style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> State & District Based Assignment:</strong> Each Project Manager card below shows ONLY unassigned Social Workers that match their exact State and District.
              This ensures that team members only work within their assigned geographic area.
            </p>
            <div className="info-stats">
              <span className="stat-badge">
                Total Unassigned SWs: <strong>{getTotalUnassignedSocialWorkers()}</strong>
              </span>
            </div>
          </div>

          <div className="assignment-grid">
            {projectManagers.filter(pm => pm.area_manager_id).map(projectManager => {
              const areaManager = areaManagers.find(am => am.id === projectManager.area_manager_id);
              return (
                <div key={projectManager.id} className="assignment-card">
                  <div className="assignment-card-header">
                    <h4>{projectManager.name}</h4>
                    <p className="assignment-location">{projectManager.state} - {projectManager.district}</p>
                    {areaManager && (
                      <p className="assignment-reporting">Reports to: {areaManager.name}</p>
                    )}
                  </div>


                  <div className="unassigned-list">
                    <h5>
                      Unassigned Social Workers (Matching: {projectManager.state} - {projectManager.district})
                      <span className="count-badge-small">({getFilteredUnassignedSocialWorkers(projectManager).filter(sw => sw.project_manager_id === null || sw.project_manager_id === undefined).length})</span>
                    </h5>
                    {getFilteredUnassignedSocialWorkers(projectManager).filter(sw => sw.project_manager_id === null || sw.project_manager_id === undefined).length > 0 ? (
                      getFilteredUnassignedSocialWorkers(projectManager).filter(sw => sw.project_manager_id === null || sw.project_manager_id === undefined).map(sw => (
                        <div key={sw.id} className="assignment-item">
                          <div>
                            <span>{sw.name} ({sw.id_no})</span>
                            {sw.state && sw.district && (
                              <span className="location-tag">✓ {sw.state} - {sw.district}</span>
                            )}
                          </div>
                          <button
                            className="btn-small btn-primary"
                            onClick={() => handleAssignSocialWorker(sw.id, projectManager.id)}
                          >
                            Assign
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-item-box">
                        <p className="empty-item">
                          No unassigned Social Workers found matching <strong>{projectManager.state} - {projectManager.district}</strong>
                        </p>
                        <p className="empty-item-hint">
                          Social Workers must have the same State and District as this Project Manager to be assigned.
                          Already assigned members will not appear in other sections.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="assigned-list">
                    <h5>Assigned Social Workers</h5>
                    {socialWorkers.filter(sw => sw.project_manager_id === projectManager.id).map(sw => (
                      <div key={sw.id} className="assignment-item assigned">
                        <div>
                          <span>{sw.name} ({sw.id_no})</span>
                          {sw.state && sw.district && (
                            <span className="location-tag">✓ {sw.state} - {sw.district}</span>
                          )}
                        </div>
                        <div className="assigned-actions">
                          <span className="assigned-badge">✓ Assigned</span>
                          <button
                            className="btn-small btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnassignSocialWorker(sw.id);
                            }}
                            title="Unassign this Social Worker"
                          >
                            Unassign
                          </button>
                        </div>
                      </div>
                    ))}
                    {socialWorkers.filter(sw => sw.project_manager_id === projectManager.id).length === 0 && (
                      <p className="empty-item">No assigned Social Workers</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {projectManagers.filter(pm => pm.area_manager_id).length === 0 && (
            <p className="empty-state">
              No Project Managers with assigned Area Managers. Please assign Project Managers to Area Managers first.
            </p>
          )}

          {/* Unmatched Social Workers Section */}
          {getUnmatchedSocialWorkers().length > 0 && (
            <div className="unmatched-section">
              <div className="unmatched-header">
                <h3>⚠️ Unassigned Social Workers Without Matching Project Manager</h3>
                <p className="unmatched-description">
                  The following Social Workers cannot be assigned because there is no Project Manager with matching State/District.
                  <br />
                  <strong>Action Required:</strong> Create a Project Manager for their State/District, or update their State/District to match an existing Project Manager.
                </p>
              </div>
              <div className="unmatched-list">
                {getUnmatchedSocialWorkers().map(sw => (
                  <div key={sw.id} className="unmatched-item">
                    <div className="unmatched-info">
                      <span className="unmatched-name">{sw.name} ({sw.id_no})</span>
                      <span className="unmatched-location">📍 {sw.state} - {sw.district}</span>
                    </div>
                    <span className="unmatched-badge">No Matching Project Manager</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {unassignPMConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Unassign</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>Are you sure you want to unassign this Project Manager?</p>
              <p style={{ color: '#f0ad4e', fontWeight: 'bold', marginTop: '1rem' }}>They will be moved back to the unassigned list.</p>
            </div>
            <div className="form-actions">
              <button className="btn-danger" onClick={confirmUnassignPM}>
                Unassign
              </button>
              <button className="btn-secondary" onClick={cancelUnassignPM}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {unassignSWConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Unassign</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p>Are you sure you want to unassign this Social Worker?</p>
              <p style={{ color: '#f0ad4e', fontWeight: 'bold', marginTop: '1rem' }}>They will be moved back to the unassigned list.</p>
            </div>
            <div className="form-actions">
              <button className="btn-danger" onClick={confirmUnassignSW}>
                Unassign
              </button>
              <button className="btn-secondary" onClick={cancelUnassignSW}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignments;


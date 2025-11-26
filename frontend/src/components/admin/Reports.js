import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
    getAreaManagers,
    getProjectManagers,
    getSocialWorkers,
    getProjects,
    getAdmins,
    getBoardMembers
} from '../../utils/dataManager';
import { IoMdDocument, IoMdGrid } from 'react-icons/io';
import './Reports.css';

const REPORT_CONFIG = {
    projects: {
        label: 'Projects',
        fields: [
            { key: 'title', label: 'Project Title' },
            { key: 'status', label: 'Status' },
            { key: 'category', label: 'Category' },
            { key: 'location', label: 'Location' },
            { key: 'area_of_operation', label: 'Area of Operation' },
            { key: 'target_beneficiaries', label: 'Target Beneficiaries' },
            { key: 'description', label: 'Description' },
            { key: 'area_manager_name', label: 'Area Manager' },
            { key: 'project_manager_name', label: 'Project Manager' },
            { key: 'social_worker_name', label: 'Social Worker' },
            { key: 'created_at', label: 'Created At' }
        ]
    },
    areaManagers: {
        label: 'Area Managers',
        fields: [
            { key: 'id_no', label: 'ID No' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'state', label: 'State' },
            { key: 'district', label: 'District' },
            { key: 'status', label: 'Status' },
            { key: 'project_count', label: 'Total Projects' },
            { key: 'assigned_pm_count', label: 'Assigned PMs (Count)' },
            { key: 'assigned_pms', label: 'Assigned PMs (Names)' }
        ]
    },
    projectManagers: {
        label: 'Project Managers',
        fields: [
            { key: 'id_no', label: 'ID No' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'state', label: 'State' },
            { key: 'district', label: 'District' },
            { key: 'area_manager_name', label: 'Area Manager' },
            { key: 'status', label: 'Status' },
            { key: 'project_count', label: 'Total Projects' },
            { key: 'assigned_sw_count', label: 'Assigned SWs (Count)' },
            { key: 'assigned_sws', label: 'Assigned SWs (Names)' }
        ]
    },
    socialWorkers: {
        label: 'Social Workers',
        fields: [
            { key: 'id_no', label: 'ID No' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'state', label: 'State' },
            { key: 'district', label: 'District' },
            { key: 'project_manager_name', label: 'Project Manager' },
            { key: 'status', label: 'Status' },
            { key: 'project_count', label: 'Total Projects' }
        ]
    },
    admins: {
        label: 'Admins',
        fields: [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'created_at', label: 'Created At' }
        ]
    },
    boardMembers: {
        label: 'Board Members',
        fields: [
            { key: 'name', label: 'Name' },
            { key: 'position', label: 'Position' },
            { key: 'bio', label: 'Bio' }
        ]
    }
};

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('projects');
    const [selectedFields, setSelectedFields] = useState([]);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({
        projects: 0,
        areaManagers: 0,
        projectManagers: 0,
        socialWorkers: 0,
        admins: 0,
        boardMembers: 0
    });

    useEffect(() => {
        loadInitialStats();
        handleRoleChange('projects');
    }, []);

    const loadInitialStats = async () => {
        try {
            const [projs, ams, pms, sws, admins, board] = await Promise.all([
                getProjects({}),
                getAreaManagers(),
                getProjectManagers(),
                getSocialWorkers(),
                getAdmins(),
                getBoardMembers()
            ]);
            setStats({
                projects: projs.length,
                areaManagers: ams.length,
                projectManagers: pms.length,
                socialWorkers: sws.length,
                admins: admins.length,
                boardMembers: board.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const fetchDataForRole = async (role) => {
        setLoading(true);
        try {
            let fetchedData = [];

            // Fetch all necessary data for mapping and aggregation
            const [allProjects, ams, pms, sws] = await Promise.all([
                getProjects({}),
                getAreaManagers(),
                getProjectManagers(),
                getSocialWorkers()
            ]);

            // Create lookup maps
            const amMap = ams.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {});
            const pmMap = pms.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {});
            const swMap = sws.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {});

            if (role === 'projects') {
                fetchedData = allProjects.map(p => ({
                    ...p,
                    area_manager_name: amMap[p.area_manager_id] || 'N/A',
                    project_manager_name: pmMap[p.project_manager_id] || 'N/A',
                    social_worker_name: swMap[p.social_worker_id] || 'N/A',
                    created_at: new Date(p.created_at).toLocaleDateString()
                }));
            } else if (role === 'areaManagers') {
                fetchedData = ams.map(am => {
                    // Aggregate data
                    const myProjects = allProjects.filter(p => p.area_manager_id === am.id);
                    const myPMs = pms.filter(pm => pm.area_manager_id === am.id);

                    return {
                        ...am,
                        status: am.status || 'Active',
                        project_count: myProjects.length,
                        assigned_pm_count: myPMs.length,
                        assigned_pms: myPMs.map(pm => pm.name).join(', ') || 'None'
                    };
                });
            } else if (role === 'projectManagers') {
                fetchedData = pms.map(pm => {
                    // Aggregate data
                    const myProjects = allProjects.filter(p => p.project_manager_id === pm.id);
                    const mySWs = sws.filter(sw => sw.project_manager_id === pm.id);

                    return {
                        ...pm,
                        area_manager_name: amMap[pm.area_manager_id] || 'N/A',
                        status: pm.status || 'Active',
                        project_count: myProjects.length,
                        assigned_sw_count: mySWs.length,
                        assigned_sws: mySWs.map(sw => sw.name).join(', ') || 'None'
                    };
                });
            } else if (role === 'socialWorkers') {
                fetchedData = sws.map(sw => {
                    // Aggregate data
                    const myProjects = allProjects.filter(p => p.social_worker_id === sw.id);

                    return {
                        ...sw,
                        project_manager_name: pmMap[sw.project_manager_id] || 'N/A',
                        status: sw.status || 'Active',
                        project_count: myProjects.length
                    };
                });
            } else if (role === 'admins') {
                const admins = await getAdmins();
                fetchedData = admins.map(admin => ({
                    ...admin,
                    created_at: new Date(admin.created_at).toLocaleDateString()
                }));
            } else if (role === 'boardMembers') {
                const members = await getBoardMembers();
                fetchedData = members;
            }

            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data for report');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        // Select all fields by default
        const allFields = REPORT_CONFIG[role].fields.map(f => f.key);
        setSelectedFields(allFields);
        fetchDataForRole(role);
    };

    const handleFieldToggle = (fieldKey) => {
        setSelectedFields(prev => {
            if (prev.includes(fieldKey)) {
                return prev.filter(k => k !== fieldKey);
            } else {
                return [...prev, fieldKey];
            }
        });
    };

    const handleSelectAllFields = () => {
        const allFields = REPORT_CONFIG[selectedRole].fields.map(f => f.key);
        setSelectedFields(allFields);
    };

    const handleClearAllFields = () => {
        setSelectedFields([]);
    };

    const getSelectedFieldLabels = () => {
        return REPORT_CONFIG[selectedRole].fields
            .filter(f => selectedFields.includes(f.key))
            .map(f => f.label);
    };

    const getExportData = () => {
        return data.map(item => {
            const row = {};
            REPORT_CONFIG[selectedRole].fields.forEach(field => {
                if (selectedFields.includes(field.key)) {
                    row[field.label] = item[field.key] || '';
                }
            });
            return row;
        });
    };

    const downloadPDF = () => {
        if (selectedFields.length === 0) {
            alert('Please select at least one field to export.');
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape' });
        const title = `${REPORT_CONFIG[selectedRole].label} Report`;
        const headers = getSelectedFieldLabels();
        const exportData = getExportData();
        const rows = exportData.map(Object.values);

        doc.text(title, 14, 22);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 35,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 60, 114] }
        });

        doc.save(`${REPORT_CONFIG[selectedRole].label}_Report.pdf`);
    };

    const downloadExcel = () => {
        if (selectedFields.length === 0) {
            alert('Please select at least one field to export.');
            return;
        }

        const exportData = getExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, REPORT_CONFIG[selectedRole].label);
        XLSX.writeFile(wb, `${REPORT_CONFIG[selectedRole].label}_Report.xlsx`);
    };

    return (
        <div className="reports-container">
            <div className="reports-header-section">
                <h2>Reports & Data Export</h2>
                <p className="reports-subtitle">Generate custom reports by selecting roles and specific fields.</p>
            </div>

            <div className="reports-controls">
                {/* Role Selection */}
                <div className="control-group">
                    <label>Select Report Type:</label>
                    <div className="role-selector">
                        {Object.entries(REPORT_CONFIG).map(([key, config]) => (
                            <button
                                key={key}
                                className={`role-btn ${selectedRole === key ? 'active' : ''}`}
                                onClick={() => handleRoleChange(key)}
                            >
                                {config.label}
                                <span className="role-count">{stats[key]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Field Selection */}
                <div className="control-group">
                    <div className="fields-header">
                        <label>Select Fields to Include:</label>
                        <div className="field-actions">
                            <button className="btn-text" onClick={handleSelectAllFields}>Select All</button>
                            <button className="btn-text" onClick={handleClearAllFields}>Clear All</button>
                        </div>
                    </div>
                    <div className="fields-grid">
                        {REPORT_CONFIG[selectedRole].fields.map(field => (
                            <label key={field.key} className="field-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.key)}
                                    onChange={() => handleFieldToggle(field.key)}
                                />
                                <span className="checkmark"></span>
                                {field.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Export Actions */}
                <div className="export-actions-bar">
                    <div className="selected-summary">
                        <strong>{data.length}</strong> records found. <strong>{selectedFields.length}</strong> fields selected.
                    </div>
                    <div className="export-buttons">
                        <button
                            className="btn-secondary"
                            onClick={downloadPDF}
                            disabled={loading || data.length === 0}
                        >
                            <IoMdDocument /> Export PDF
                        </button>
                        <button
                            className="btn-primary"
                            onClick={downloadExcel}
                            disabled={loading || data.length === 0}
                        >
                            <IoMdGrid /> Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Table (Optional, showing first 5 records) */}
            {data.length > 0 && selectedFields.length > 0 && (
                <div className="report-preview">
                    <h3>Preview (First 5 records)</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {REPORT_CONFIG[selectedRole].fields
                                        .filter(f => selectedFields.includes(f.key))
                                        .map(f => <th key={f.key}>{f.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 5).map((item, index) => (
                                    <tr key={index}>
                                        {REPORT_CONFIG[selectedRole].fields
                                            .filter(f => selectedFields.includes(f.key))
                                            .map(f => <td key={f.key}>{item[f.key]}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;

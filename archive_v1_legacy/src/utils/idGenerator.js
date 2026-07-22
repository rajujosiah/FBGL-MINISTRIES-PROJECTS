/**
 * Generate FBGL ID in format: FBGL-[STATE]-[DISTRICT]-[ROLE]-[COUNT]
 * @param {string} stateCode - State code (e.g., 'AP')
 * @param {string} districtCode - District code (e.g., 'EG')
 * @param {string} role - Role code ('A' = Area Manager, 'P' = Project Manager, 'S' = Social Worker)
 * @param {number} count - Sequential count for this role in this district
 * @returns {string} Generated ID
 */
export const generateFBGLId = (stateCode, districtCode, role, count) => {
  const paddedCount = count.toString().padStart(2, '0');
  return `FBGL-${stateCode}-${districtCode}-${role}${paddedCount}`;
};

/**
 * Parse FBGL ID to extract components
 * @param {string} id - FBGL ID (e.g., 'FBGL-AP-EG-A01')
 * @returns {object} Parsed components
 */
export const parseFBGLId = (id) => {
  const parts = id.split('-');
  if (parts.length !== 4 || parts[0] !== 'FBGL') {
    throw new Error('Invalid FBGL ID format');
  }

  const roleCode = parts[3].charAt(0);
  const count = parseInt(parts[3].substring(1));

  return {
    stateCode: parts[1],
    districtCode: parts[2],
    role: roleCode,
    count: count
  };
};

/**
 * Get next count for a role in a specific district
 * @param {string} stateCode - State code
 * @param {string} districtCode - District code
 * @param {string} role - Role code
 * @param {Array} existingIds - Array of existing IDs
 * @returns {number} Next count number
 */
export const getNextCount = (stateCode, districtCode, role, existingIds) => {
  const pattern = `FBGL-${stateCode}-${districtCode}-${role}`;
  const matchingIds = existingIds.filter(id => id.startsWith(pattern));
  
  if (matchingIds.length === 0) return 1;
  
  const counts = matchingIds.map(id => {
    const countPart = id.split('-')[3].substring(1);
    return parseInt(countPart);
  });
  
  return Math.max(...counts) + 1;
};

/**
 * State and District mappings
 */
export const STATE_CODES = {
  'Andhra Pradesh': 'AP',
  'Telangana': 'TS',
  'Tamil Nadu': 'TN',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Maharashtra': 'MH',
  'Gujarat': 'GJ',
  'Rajasthan': 'RJ',
  'Uttar Pradesh': 'UP',
  'Delhi': 'DL'
};

export const DISTRICT_CODES = {
  'East Godavari': 'EG',
  'West Godavari': 'WG',
  'Krishna': 'KR',
  'Guntur': 'GU',
  'Prakasam': 'PR',
  'Nellore': 'NE',
  'Chittoor': 'CH',
  'Kadapa': 'KA',
  'Anantapur': 'AN',
  'Kurnool': 'KU'
};

export const ROLE_CODES = {
  'area_manager': 'A',
  'project_manager': 'P',
  'social_worker': 'S'
};

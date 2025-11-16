// Data Manager - Supabase Only (No Fallback)
// This manages all team members, projects, and assignments using Supabase only

// Import Supabase data manager
import * as supabaseManager from './supabaseDataManager';

// Error class for connection issues
export class ConnectionError extends Error {
  constructor(message = 'Failed to connect to the server. Please check your internet connection.') {
    super(message);
    this.name = 'ConnectionError';
  }
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  return !!(supabaseUrl && 
           supabaseUrl !== 'https://your-project.supabase.co' &&
           supabaseKey && 
           supabaseKey !== 'your-anon-key');
};

// Initialize Supabase connection
export const initializeData = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment variables.');
  }

  try {
    const initialized = await supabaseManager.initializeData();
    if (!initialized) {
      throw new ConnectionError('Failed to connect to Supabase. Please check your internet connection and try again.');
    }
    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    throw new ConnectionError('Failed to connect to the server. Please check your internet connection.');
  }
};

// ============================================================================
// AREA MANAGERS
// ============================================================================
export const getAreaManagers = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getAreaManagers();
  } catch (error) {
    console.error('Error fetching area managers:', error);
    throw new ConnectionError('Failed to fetch area managers. Please check your internet connection.');
  }
};

export const addAreaManager = async (manager) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addAreaManager(manager);
  } catch (error) {
    console.error('Error adding area manager:', error);
    throw new ConnectionError('Failed to save area manager. Please check your internet connection.');
  }
};

export const updateAreaManager = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.updateAreaManager(id, updates);
  } catch (error) {
    console.error('Error updating area manager:', error);
    throw new ConnectionError('Failed to update area manager. Please check your internet connection.');
  }
};

export const deleteAreaManager = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.deleteAreaManager(id);
  } catch (error) {
    console.error('Error deleting area manager:', error);
    throw new ConnectionError('Failed to delete area manager. Please check your internet connection.');
  }
};

export const assignStateDistrictToAreaManager = async (areaManagerId, state, district) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.assignStateDistrictToAreaManager(areaManagerId, state, district);
  } catch (error) {
    console.error('Error assigning state/district:', error);
    throw new ConnectionError('Failed to assign state/district. Please check your internet connection.');
  }
};

// ============================================================================
// PROJECT MANAGERS
// ============================================================================
export const getProjectManagers = async (areaManagerId = null) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getProjectManagers(areaManagerId);
  } catch (error) {
    console.error('Error fetching project managers:', error);
    throw new ConnectionError('Failed to fetch project managers. Please check your internet connection.');
  }
};

export const getProjectManagerById = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getProjectManagerById(id);
  } catch (error) {
    console.error('Error fetching project manager:', error);
    throw new ConnectionError('Failed to fetch project manager. Please check your internet connection.');
  }
};

export const addProjectManager = async (manager) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addProjectManager(manager);
  } catch (error) {
    console.error('Error adding project manager:', error);
    throw new ConnectionError('Failed to save project manager. Please check your internet connection.');
  }
};

export const updateProjectManager = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.updateProjectManager(id, updates);
  } catch (error) {
    console.error('Error updating project manager:', error);
    throw new ConnectionError('Failed to update project manager. Please check your internet connection.');
  }
};

export const deleteProjectManager = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.deleteProjectManager(id);
  } catch (error) {
    console.error('Error deleting project manager:', error);
    throw new ConnectionError('Failed to delete project manager. Please check your internet connection.');
  }
};

export const assignProjectManagerToAreaManager = async (projectManagerId, areaManagerId) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.assignProjectManagerToAreaManager(projectManagerId, areaManagerId);
  } catch (error) {
    console.error('Error assigning project manager:', error);
    throw new ConnectionError('Failed to assign project manager. Please check your internet connection.');
  }
};

export const unassignProjectManager = async (projectManagerId) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.unassignProjectManager(projectManagerId);
  } catch (error) {
    console.error('Error unassigning project manager:', error);
    throw new ConnectionError('Failed to unassign project manager. Please check your internet connection.');
  }
};

export const assignProjectToProjectManager = async (projectId, projectManagerId) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.assignProjectToProjectManager(projectId, projectManagerId);
  } catch (error) {
    console.error('Error assigning project:', error);
    throw new ConnectionError('Failed to assign project. Please check your internet connection.');
  }
};

// ============================================================================
// SOCIAL WORKERS
// ============================================================================
export const getSocialWorkers = async (projectManagerId = null) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getSocialWorkers(projectManagerId);
  } catch (error) {
    console.error('Error fetching social workers:', error);
    throw new ConnectionError('Failed to fetch social workers. Please check your internet connection.');
  }
};

export const addSocialWorker = async (worker) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addSocialWorker(worker);
  } catch (error) {
    console.error('Error adding social worker:', error);
    throw new ConnectionError('Failed to save social worker. Please check your internet connection.');
  }
};

export const updateSocialWorker = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.updateSocialWorker(id, updates);
  } catch (error) {
    console.error('Error updating social worker:', error);
    throw new ConnectionError('Failed to update social worker. Please check your internet connection.');
  }
};

export const deleteSocialWorker = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.deleteSocialWorker(id);
  } catch (error) {
    console.error('Error deleting social worker:', error);
    throw new ConnectionError('Failed to delete social worker. Please check your internet connection.');
  }
};

export const assignSocialWorkerToProjectManager = async (socialWorkerId, projectManagerId) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.assignSocialWorkerToProjectManager(socialWorkerId, projectManagerId);
  } catch (error) {
    console.error('Error assigning social worker:', error);
    throw new ConnectionError('Failed to assign social worker. Please check your internet connection.');
  }
};

export const unassignSocialWorker = async (socialWorkerId) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.unassignSocialWorker(socialWorkerId);
  } catch (error) {
    console.error('Error unassigning social worker:', error);
    throw new ConnectionError('Failed to unassign social worker. Please check your internet connection.');
  }
};

// ============================================================================
// PROJECTS
// ============================================================================
export const getProjects = async (filters = {}) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getProjects(filters);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new ConnectionError('Failed to fetch projects. Please check your internet connection.');
  }
};

export const addProject = async (project) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addProject(project);
  } catch (error) {
    console.error('Error adding project:', error);
    throw new ConnectionError('Failed to save project. Please check your internet connection.');
  }
};

export const updateProject = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.updateProject(id, updates);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new ConnectionError('Failed to update project. Please check your internet connection.');
  }
};

export const addProjectImages = async (projectId, images) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addProjectImages(projectId, images);
  } catch (error) {
    console.error('Error adding project images:', error);
    throw new ConnectionError('Failed to upload images. Please check your internet connection.');
  }
};

// ============================================================================
// BLOG POSTS
// ============================================================================
export const getBlogPosts = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new ConnectionError('Failed to fetch blog posts. Please check your internet connection.');
  }
};

export const addBlogPost = async (post) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addBlogPost(post);
  } catch (error) {
    console.error('Error adding blog post:', error);
    throw new ConnectionError('Failed to save blog post. Please check your internet connection.');
  }
};

export const updateBlogPost = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.updateBlogPost(id, updates);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new ConnectionError('Failed to update blog post. Please check your internet connection.');
  }
};

export const deleteBlogPost = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.deleteBlogPost(id);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new ConnectionError('Failed to delete blog post. Please check your internet connection.');
  }
};

// ============================================================================
// BOARD MEMBERS
// ============================================================================
export const getBoardMembers = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getBoardMembers();
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw new ConnectionError('Failed to fetch board members. Please check your internet connection.');
  }
};

// ============================================================================
// STATE/DISTRICT MANAGEMENT (localStorage only - not in Supabase)
// ============================================================================
const STORAGE_KEYS = {
  STATE_DISTRICTS: 'fbgl_state_districts'
};

const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error);
    return [];
  }
};

const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting data to ${key}:`, error);
    return false;
  }
};

export const getStateDistricts = () => getData(STORAGE_KEYS.STATE_DISTRICTS);

export const addStateDistrict = (stateDistrict) => {
  const stateDistricts = getStateDistricts();
  const exists = stateDistricts.find(
    sd => sd.state === stateDistrict.state && sd.district === stateDistrict.district
  );
  if (exists) return exists;
  
  const newSD = {
    ...stateDistrict,
    id: stateDistricts.length > 0 ? Math.max(...stateDistricts.map(sd => sd.id)) + 1 : 1,
    created_at: new Date().toISOString()
  };
  stateDistricts.push(newSD);
  setData(STORAGE_KEYS.STATE_DISTRICTS, stateDistricts);
  return newSD;
};

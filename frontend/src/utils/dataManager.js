// Data Manager - Supabase with Caching
// This manages all team members, projects, and assignments using Supabase with intelligent caching

// Import Supabase data manager
import * as supabaseManager from './supabaseDataManager';

// Import cache manager
import {
  getCachedData,
  setCachedData,
  invalidateCache,
  invalidateCacheType,
  clearAllCache,
  CACHE_TYPES
} from './cacheManager';

// Import Realtime manager
import { initializeRealtimeSubscriptions } from './realtimeManager';

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

    // Initialize Realtime Subscriptions
    initializeRealtimeSubscriptions();

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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.AREA_MANAGERS);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getAreaManagers();
    // Cache the result
    setCachedData(CACHE_TYPES.AREA_MANAGERS, data);
    return data;
  } catch (error) {
    console.error('Error fetching area managers:', error);
    throw new ConnectionError('Failed to fetch area managers. Please check your internet connection.');
  }
};

export const getAreaManagerById = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getAreaManagerById(id);
  } catch (error) {
    console.error('Error fetching area manager:', error);
    throw new ConnectionError('Failed to fetch area manager. Please check your internet connection.');
  }
};

export const addAreaManager = async (manager) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addAreaManager(manager);
    invalidateCacheType(CACHE_TYPES.AREA_MANAGERS);
    return result;
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
    const result = await supabaseManager.updateAreaManager(id, updates);
    invalidateCacheType(CACHE_TYPES.AREA_MANAGERS);
    return result;
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
    const result = await supabaseManager.deleteAreaManager(id);
    invalidateCacheType(CACHE_TYPES.AREA_MANAGERS);
    return result;
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
    const result = await supabaseManager.assignStateDistrictToAreaManager(areaManagerId, state, district);
    invalidateCacheType(CACHE_TYPES.AREA_MANAGERS);
    return result;
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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.PROJECT_MANAGERS, { areaManagerId });
  if (cached) return cached;

  try {
    const data = await supabaseManager.getProjectManagers(areaManagerId);
    // Cache the result
    setCachedData(CACHE_TYPES.PROJECT_MANAGERS, data, { areaManagerId });
    return data;
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
    const result = await supabaseManager.addProjectManager(manager);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    return result;
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
    const result = await supabaseManager.updateProjectManager(id, updates);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    return result;
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
    const result = await supabaseManager.deleteProjectManager(id);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    return result;
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
    const result = await supabaseManager.assignProjectManagerToAreaManager(projectManagerId, areaManagerId);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    return result;
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
    const result = await supabaseManager.unassignProjectManager(projectManagerId);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    return result;
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
    const result = await supabaseManager.assignProjectToProjectManager(projectId, projectManagerId);
    invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
    invalidateCacheType(CACHE_TYPES.PROJECTS);
    return result;
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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.SOCIAL_WORKERS, { projectManagerId });
  if (cached) return cached;

  try {
    const data = await supabaseManager.getSocialWorkers(projectManagerId);
    // Cache the result
    setCachedData(CACHE_TYPES.SOCIAL_WORKERS, data, { projectManagerId });
    return data;
  } catch (error) {
    console.error('Error fetching social workers:', error);
    throw new ConnectionError('Failed to fetch social workers. Please check your internet connection.');
  }
};

export const getSocialWorkerById = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getSocialWorkerById(id);
  } catch (error) {
    console.error('Error fetching social worker:', error);
    throw new ConnectionError('Failed to fetch social worker. Please check your internet connection.');
  }
};

export const addSocialWorker = async (worker) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addSocialWorker(worker);
    invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
    return result;
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
    const result = await supabaseManager.updateSocialWorker(id, updates);
    invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
    return result;
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
    const result = await supabaseManager.deleteSocialWorker(id);
    invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
    return result;
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
    const result = await supabaseManager.assignSocialWorkerToProjectManager(socialWorkerId, projectManagerId);
    invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
    return result;
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
    const result = await supabaseManager.unassignSocialWorker(socialWorkerId);
    invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
    return result;
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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.PROJECTS, filters);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getProjects(filters);
    // Cache the result
    setCachedData(CACHE_TYPES.PROJECTS, data, filters);
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new ConnectionError('Failed to fetch projects. Please check your internet connection.');
  }
};

export const getProjectById = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getProjectById(id);
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new ConnectionError('Failed to fetch project. Please check your internet connection.');
  }
};

export const addProject = async (project) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addProject(project);
    invalidateCacheType(CACHE_TYPES.PROJECTS);
    invalidateCacheType(CACHE_TYPES.HOME_PROJECTS);
    return result;
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
    const result = await supabaseManager.updateProject(id, updates);
    invalidateCacheType(CACHE_TYPES.PROJECTS);
    invalidateCacheType(CACHE_TYPES.HOME_PROJECTS);
    return result;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new ConnectionError('Failed to update project. Please check your internet connection.');
  }
};

export const getHomePageProjects = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.HOME_PROJECTS);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getHomePageProjects();
    // Cache the result
    setCachedData(CACHE_TYPES.HOME_PROJECTS, data);
    return data;
  } catch (error) {
    console.error('Error fetching home page projects:', error);
    throw new ConnectionError('Failed to fetch home page projects. Please check your internet connection.');
  }
};

export const toggleProjectHomeStatus = async (id, showOnHome) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.toggleProjectHomeStatus(id, showOnHome);
    invalidateCacheType(CACHE_TYPES.PROJECTS);
    invalidateCacheType(CACHE_TYPES.HOME_PROJECTS);
    return result;
  } catch (error) {
    console.error('Error toggling project home status:', error);
    throw new ConnectionError('Failed to update project status. Please check your internet connection.');
  }
};

export const addProjectImages = async (projectId, images) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addProjectImages(projectId, images);
    invalidateCacheType(CACHE_TYPES.PROJECTS);
    invalidateCacheType(CACHE_TYPES.HOME_PROJECTS);
    return result;
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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.BLOG_POSTS);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getBlogPosts();
    // Cache the result
    setCachedData(CACHE_TYPES.BLOG_POSTS, data);
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new ConnectionError('Failed to fetch blog posts. Please check your internet connection.');
  }
};

export const getBlogPostById = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getBlogPostById(id);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new ConnectionError('Failed to fetch blog post. Please check your internet connection.');
  }
};

export const addBlogPost = async (post) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addBlogPost(post);
    invalidateCacheType(CACHE_TYPES.BLOG_POSTS);
    return result;
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
    const result = await supabaseManager.updateBlogPost(id, updates);
    invalidateCacheType(CACHE_TYPES.BLOG_POSTS);
    return result;
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
    const result = await supabaseManager.deleteBlogPost(id);
    invalidateCacheType(CACHE_TYPES.BLOG_POSTS);
    return result;
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

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.BOARD_MEMBERS);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getBoardMembers();
    // Cache the result
    setCachedData(CACHE_TYPES.BOARD_MEMBERS, data);
    return data;
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw new ConnectionError('Failed to fetch board members. Please check your internet connection.');
  }
};

export const addBoardMember = async (member) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addBoardMember(member);
    invalidateCacheType(CACHE_TYPES.BOARD_MEMBERS);
    return result;
  } catch (error) {
    console.error('Error adding board member:', error);
    throw new ConnectionError('Failed to add board member. Please check your internet connection.');
  }
};

export const updateBoardMember = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.updateBoardMember(id, updates);
    invalidateCacheType(CACHE_TYPES.BOARD_MEMBERS);
    return result;
  } catch (error) {
    console.error('Error updating board member:', error);
    throw new ConnectionError('Failed to update board member. Please check your internet connection.');
  }
};

export const deleteBoardMember = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.deleteBoardMember(id);
    invalidateCacheType(CACHE_TYPES.BOARD_MEMBERS);
    return result;
  } catch (error) {
    console.error('Error deleting board member:', error);
    throw new ConnectionError('Failed to delete board member. Please check your internet connection.');
  }
};

// ============================================================================
// STATE/DISTRICT MANAGEMENT
// ============================================================================
export const getStateDistricts = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.getStateDistricts();
  } catch (error) {
    console.error('Error fetching state districts:', error);
    throw new ConnectionError('Failed to fetch state districts. Please check your internet connection.');
  }
};

export const addStateDistrict = async (stateDistrict) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.addStateDistrict(stateDistrict);
  } catch (error) {
    console.error('Error adding state district:', error);
    throw new ConnectionError('Failed to save state district. Please check your internet connection.');
  }
};

// ============================================================================
// ADMINS
// ============================================================================
export const getAdmins = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  // Check cache first
  const cached = getCachedData(CACHE_TYPES.ADMINS);
  if (cached) return cached;

  try {
    const data = await supabaseManager.getAdmins();
    // Cache the result
    setCachedData(CACHE_TYPES.ADMINS, data);
    return data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw new ConnectionError('Failed to fetch admins. Please check your internet connection.');
  }
};

export const addAdmin = async (admin) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.addAdmin(admin);
    invalidateCacheType(CACHE_TYPES.ADMINS);
    return result;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw new ConnectionError('Failed to save admin. Please check your internet connection.');
  }
};

export const updateAdmin = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.updateAdmin(id, updates);
    invalidateCacheType(CACHE_TYPES.ADMINS);
    return result;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw new ConnectionError('Failed to update admin. Please check your internet connection.');
  }
};

export const deleteAdmin = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.deleteAdmin(id);
    invalidateCacheType(CACHE_TYPES.ADMINS);
    return result;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw new ConnectionError('Failed to delete admin. Please check your internet connection.');
  }
};

// ============================================================================
// SYSTEM
// ============================================================================
export const clearAllData = async () => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    const result = await supabaseManager.clearAllData();
    clearAllCache();
    return result;
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new ConnectionError('Failed to clear data. Please check your internet connection.');
  }
};

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const loginUser = async (username, password) => {
  if (!isSupabaseConfigured()) {
    throw new ConnectionError('Database connection not configured. Please contact administrator.');
  }

  try {
    return await supabaseManager.loginUser(username, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw new ConnectionError('Failed to login. Please check your internet connection.');
  }
};

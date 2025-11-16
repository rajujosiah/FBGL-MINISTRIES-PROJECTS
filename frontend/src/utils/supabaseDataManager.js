// Supabase Data Manager
// This manages all team members, projects, and assignments using Supabase

import { supabase } from './supabase';
import { ConnectionError } from './dataManager';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  
  // Check if it's a network/connection error
  if (error.message && (
    error.message.includes('fetch') || 
    error.message.includes('network') ||
    error.message.includes('Failed to fetch') ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT'
  )) {
    throw new ConnectionError('Failed to connect to the server. Please check your internet connection.');
  }
  
  // Generic connection error
  throw new ConnectionError(`Failed to ${operation}. Please check your internet connection.`);
};

// ============================================================================
// AREA MANAGERS
// ============================================================================
export const getAreaManagers = async () => {
  try {
    const { data, error } = await supabase
      .from('area_managers')
      .select('*')
      .order('id_no', { ascending: true });

    if (error) {
      console.error('Error fetching area managers:', error);
      throw new ConnectionError('Failed to fetch area managers. Please check your internet connection.');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    // Network errors, timeouts, etc.
    throw new ConnectionError('Failed to connect to the server. Please check your internet connection.');
  }
};

export const getAreaManagerById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('area_managers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, 'fetch area manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch area manager');
  }
};

export const addAreaManager = async (manager) => {
  try {
    const { data, error } = await supabase
      .from('area_managers')
      .insert([{
        ...manager,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add area manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add area manager');
  }
};

export const updateAreaManager = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('area_managers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update area manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update area manager');
  }
};

export const deleteAreaManager = async (id) => {
  try {
    const { error } = await supabase
      .from('area_managers')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete area manager');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete area manager');
  }
};

export const assignStateDistrictToAreaManager = async (areaManagerId, state, district) => {
  return updateAreaManager(areaManagerId, {
    state,
    district,
    area_manager: `${state} - ${district}`
  });
};

// ============================================================================
// PROJECT MANAGERS
// ============================================================================
export const getProjectManagers = async (areaManagerId = null) => {
  try {
    let query = supabase
      .from('project_managers')
      .select('*');

    if (areaManagerId) {
      query = query.eq('area_manager_id', areaManagerId);
    }

    const { data, error } = await query.order('id_no', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'fetch project managers');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch project managers');
  }
};

export const getProjectManagerById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('project_managers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, 'fetch project manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch project manager');
  }
};

export const addProjectManager = async (manager) => {
  try {
    const { data, error } = await supabase
      .from('project_managers')
      .insert([{
        ...manager,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add project manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add project manager');
  }
};

export const updateProjectManager = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('project_managers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update project manager');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update project manager');
  }
};

export const deleteProjectManager = async (id) => {
  try {
    const { error } = await supabase
      .from('project_managers')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete project manager');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete project manager');
  }
};

export const assignProjectManagerToAreaManager = async (projectManagerId, areaManagerId) => {
  // Get area manager to inherit state/district
  const areaManager = await getAreaManagerById(areaManagerId);
  if (!areaManager) return null;

  return updateProjectManager(projectManagerId, {
    area_manager_id: areaManagerId,
    state: areaManager.state,
    district: areaManager.district
  });
};

export const unassignProjectManager = async (projectManagerId) => {
  return updateProjectManager(projectManagerId, {
    area_manager_id: null
  });
};

export const assignProjectToProjectManager = async (projectId, projectManagerId) => {
  const projectManager = await getProjectManagerById(projectManagerId);
  if (!projectManager) return null;

  return updateProject(projectId, {
    project_manager_id: projectManagerId,
    state: projectManager.state,
    district: projectManager.district
  });
};

// ============================================================================
// SOCIAL WORKERS
// ============================================================================
export const getSocialWorkers = async (projectManagerId = null) => {
  try {
    let query = supabase
      .from('social_workers')
      .select('*');

    if (projectManagerId) {
      query = query.eq('project_manager_id', projectManagerId);
    }

    const { data, error } = await query.order('id_no', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'fetch social workers');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch social workers');
  }
};

export const getSocialWorkerById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('social_workers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, 'fetch social worker');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch social worker');
  }
};

export const addSocialWorker = async (worker) => {
  try {
    const { data, error } = await supabase
      .from('social_workers')
      .insert([{
        ...worker,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add social worker');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add social worker');
  }
};

export const updateSocialWorker = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('social_workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update social worker');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update social worker');
  }
};

export const deleteSocialWorker = async (id) => {
  try {
    const { error } = await supabase
      .from('social_workers')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete social worker');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete social worker');
  }
};

export const assignSocialWorkerToProjectManager = async (socialWorkerId, projectManagerId) => {
  // Get project manager to inherit state/district
  const projectManager = await getProjectManagerById(projectManagerId);
  if (!projectManager) return null;

  return updateSocialWorker(socialWorkerId, {
    project_manager_id: projectManagerId,
    state: projectManager.state,
    district: projectManager.district
  });
};

export const unassignSocialWorker = async (socialWorkerId) => {
  return updateSocialWorker(socialWorkerId, {
    project_manager_id: null
  });
};

// ============================================================================
// PROJECTS
// ============================================================================
export const getProjects = async (filters = {}) => {
  try {
    let query = supabase
      .from('projects')
      .select('*');

    if (filters.socialWorkerId) {
      query = query.eq('social_worker_id', filters.socialWorkerId);
    }

    if (filters.projectManagerId) {
      query = query.eq('project_manager_id', filters.projectManagerId);
    }

    if (filters.areaManagerId) {
      // Get project managers for this area manager first
      const projectManagers = await getProjectManagers(filters.areaManagerId);
      const pmIds = projectManagers.map(pm => pm.id);
      if (pmIds.length > 0) {
        query = query.in('project_manager_id', pmIds);
      } else {
        return []; // No project managers, so no projects
      }
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'fetch projects');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch projects');
  }
};

export const getProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, 'fetch project');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch project');
  }
};

export const addProject = async (project) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        images: project.images || [],
        project_manager_id: project.project_manager_id || null,
        social_worker_id: project.social_worker_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add project');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add project');
  }
};

export const updateProject = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update project');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update project');
  }
};

export const deleteProject = async (id) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete project');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete project');
  }
};

export const addProjectImages = async (projectId, images) => {
  const project = await getProjectById(projectId);
  if (!project) return null;

  const currentImages = project.images || [];
  const newImages = Array.isArray(images) ? images : [images];
  const updatedImages = [...currentImages, ...newImages];

  return updateProject(projectId, { images: updatedImages });
};

// ============================================================================
// BLOG POSTS
// ============================================================================
export const getBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'fetch blog posts');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch blog posts');
  }
};

export const getBlogPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, 'fetch blog post');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch blog post');
  }
};

export const addBlogPost = async (post) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        published: post.published !== undefined ? post.published : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add blog post');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add blog post');
  }
};

export const updateBlogPost = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update blog post');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update blog post');
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete blog post');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete blog post');
  }
};

// ============================================================================
// BOARD MEMBERS
// ============================================================================
export const getBoardMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'fetch board members');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch board members');
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================
export const initializeData = async () => {
  // Check if Supabase is configured
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' ||
      !supabaseKey || supabaseKey === 'your-anon-key') {
    throw new ConnectionError('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment variables.');
  }

  // Test connection
  try {
    const { data, error } = await supabase.from('area_managers').select('id').limit(1);
    if (error) {
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

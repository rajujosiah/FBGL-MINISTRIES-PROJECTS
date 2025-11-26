// Supabase Data Manager
// This manages all team members, projects, and assignments using Supabase

import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';
import { ConnectionError } from './dataManager';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Create admin client if service role key is available
// WARNING: Only use this in a secure environment or if you understand the risks of exposing the service role key in the frontend
const adminSupabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;

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

  // Pass through specific auth/validation errors
  if (error.message && (
    error.message.includes('Invalid login credentials') ||
    error.message.includes('already been registered') ||
    error.message.includes('already exists') ||
    error.status === 400 ||
    error.status === 422
  )) {
    throw new Error(error.message);
  }

  // Generic connection error for other cases
  throw new ConnectionError(`Failed to ${operation}. Please check your internet connection.`);
};

// Helper function to create a user in Supabase auth and in the public table
const createUser = async (userData, tableName) => {
  try {
    let authUser = null;
    let authError = null;

    // 1. Try to create user using admin API (works if service_role key is configured)
    if (adminSupabase) {
      try {
        console.log(`Attempting to create user ${userData.email} using Admin API...`);
        const { data, error } = await adminSupabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.name,
            role: tableName.slice(0, -1)
          }
        });

        if (!error && data?.user) {
          authUser = data.user;
          console.log('User created successfully via Admin API');
        } else if (error?.message?.includes('already been registered')) {
          console.log('User already exists. Updating password and metadata...');
          // If user exists, we need to find them and update their password
          // Since we can't easily "get by email" with the admin client in a single call without listUsers permission which might be restricted,
          // we'll try to list users filtering by email.
          const { data: listData, error: listError } = await adminSupabase.auth.admin.listUsers();

          if (!listError && listData?.users) {
            const existingUser = listData.users.find(u => u.email === userData.email);
            if (existingUser) {
              // Update the existing user's password and metadata
              const { data: updateData, error: updateError } = await adminSupabase.auth.admin.updateUserById(
                existingUser.id,
                {
                  password: userData.password,
                  email_confirm: true,
                  user_metadata: {
                    full_name: userData.name,
                    role: tableName.slice(0, -1)
                  }
                }
              );

              if (!updateError && updateData?.user) {
                authUser = updateData.user;
                console.log('Existing user updated successfully');
              } else {
                authError = updateError || new Error('Failed to update existing user');
              }
            } else {
              authError = new Error('User reported as existing but could not be found in list');
            }
          } else {
            authError = listError || new Error('Failed to list users to find existing one');
          }
        } else {
          console.error('Admin API error:', error);
          authError = error;
        }
      } catch (e) {
        console.log('Admin create user failed, falling back to signUp:', e);
      }
    } else {
      console.log('No Service Role Key found. Skipping Admin API attempt.');
    }

    // 2. If admin creation failed or not available, try client-side signUp
    // We use a temporary client to avoid logging out the current admin user
    if (!authUser) {
      try {
        const tempSupabase = createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false, // Don't save session to localStorage
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        });

        const { data, error } = await tempSupabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.name,
              role: tableName.slice(0, -1)
            }
          }
        });

        if (error) {
          authError = error;
        } else if (data?.user) {
          authUser = data.user;
          // If email confirmation is enabled, the user won't be able to login until confirmed
          // We can't auto-confirm from client side without service role
        }
      } catch (e) {
        authError = e;
      }
    }

    if (authError || !authUser) {
      handleSupabaseError(authError || new Error('Failed to create auth user'), `create auth user for ${tableName}`);
    }

    // Insert the user profile into the public table, linking it to the auth user
    // Insert the user profile into the public table
    // IMPORTANT: The tables (area_managers, etc.) use BIGINT for 'id', but authUser.id is a UUID.
    // We CANNOT set 'id' to authUser.id. We must let the database auto-generate the BIGINT 'id'.
    // We should store the auth_user_id in a separate column if the schema supports it, 
    // or rely on email matching if that's how the app is designed.

    const profileData = {
      ...userData,
      // id: authUser.id, // REMOVED: Do not force UUID into BIGINT column
      // auth_user_id: authUser.id, // Optional: Add this if you add an 'auth_user_id' column to your tables
      created_at: new Date().toISOString()
    };
    delete profileData.password; // Do not store password in public table

    const { data, error } = await supabase
      .from(tableName)
      .insert([profileData])
      .select()
      .single();

    if (error) {
      // If DB insert fails, we should ideally delete the auth user, but we can't without admin rights
      // So we just report the error
      handleSupabaseError(error, `add ${tableName}`);
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, `create user in ${tableName}`);
  }
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
  return createUser(manager, 'area_managers');
};

export const updateAreaManager = async (id, updates) => {
  try {
    const updatesToApply = { ...updates };
    if (!updatesToApply.password) {
      delete updatesToApply.password;
    }

    const { data, error } = await supabase
      .from('area_managers')
      .update(updatesToApply)
      .eq('id', id)
      .select()
      .select();

    if (error) {
      handleSupabaseError(error, 'update area manager');
    }

    return data?.[0];
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
  return createUser(manager, 'project_managers');
};

export const updateProjectManager = async (id, updates) => {
  try {
    const updatesToApply = { ...updates };
    if (!updatesToApply.password) {
      delete updatesToApply.password;
    }

    // Convert empty strings to null for numeric fields
    if (updatesToApply.area_manager_id === '' || updatesToApply.area_manager_id === undefined) {
      updatesToApply.area_manager_id = null;
    }

    const { data, error } = await supabase
      .from('project_managers')
      .update(updatesToApply)
      .eq('id', id)
      .select()
      .select();

    if (error) {
      handleSupabaseError(error, 'update project manager');
    }

    return data?.[0];
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
  return createUser(worker, 'social_workers');
};

export const updateSocialWorker = async (id, updates) => {
  try {
    const updatesToApply = { ...updates };
    if (!updatesToApply.password) {
      delete updatesToApply.password;
    }

    // Convert empty strings to null for numeric fields
    if (updatesToApply.project_manager_id === '' || updatesToApply.project_manager_id === undefined) {
      updatesToApply.project_manager_id = null;
    }

    const { data, error } = await supabase
      .from('social_workers')
      .update(updatesToApply)
      .eq('id', id)
      .select()
      .select();

    if (error) {
      handleSupabaseError(error, 'update social worker');
    }

    return data?.[0];
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
      .select();

    if (error) {
      handleSupabaseError(error, 'update project');
    }

    return data?.[0];
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

// Get projects that should be shown on home page
export const getHomePageProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        social_worker:social_workers(name),
        project_manager:project_managers(name)
      `)
      .eq('show_on_home', true)
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'fetch home page projects');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch home page projects');
  }
};

// Toggle show_on_home status for a project
export const toggleProjectHomeStatus = async (id, showOnHome) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ show_on_home: showOnHome })
      .eq('id', id)
      .select()
      .select();

    if (error) {
      handleSupabaseError(error, 'update project home status');
    }

    return data?.[0];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update project home status');
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
      .select();

    if (error) {
      handleSupabaseError(error, 'update blog post');
    }

    return data?.[0];
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

export const addBoardMember = async (member) => {
  try {
    const { data, error } = await supabase
      .from('board_members')
      .insert([{
        ...member,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'add board member');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add board member');
  }
};

export const updateBoardMember = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('board_members')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .select();

    if (error) {
      handleSupabaseError(error, 'update board member');
    }

    return data?.[0];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update board member');
  }
};

export const deleteBoardMember = async (id) => {
  try {
    console.log('Attempting to delete board member with ID:', id);
    const { data, error } = await supabase
      .from('board_members')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      handleSupabaseError(error, 'delete board member');
    }

    console.log('Delete operation result:', data);
    return true;
  } catch (error) {
    console.error('Caught error in deleteBoardMember:', error);
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete board member');
  }
};

// ============================================================================
// STATE/DISTRICT MANAGEMENT
// ============================================================================
export const getStateDistricts = async () => {
  try {
    const { data, error } = await supabase
      .from('state_districts')
      .select('*')
      .order('state', { ascending: true })
      .order('district', { ascending: true });

    if (error) {
      // If table doesn't exist yet, return empty array instead of crashing
      if (error.code === '42P01') {
        console.warn('state_districts table does not exist yet');
        return [];
      }
      handleSupabaseError(error, 'fetch state districts');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch state districts');
  }
};

export const addStateDistrict = async (stateDistrict) => {
  try {
    const { data, error } = await supabase
      .from('state_districts')
      .insert([{
        ...stateDistrict,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      // Ignore unique constraint violations (duplicate state/district)
      if (error.code === '23505') {
        return null;
      }
      handleSupabaseError(error, 'add state district');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'add state district');
  }
};

// ============================================================================
// ADMINS
// ============================================================================
export const getAdmins = async () => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'fetch admins');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'fetch admins');
  }
};

export const addAdmin = async (admin) => {
  // Use 'admins' table and 'admin' role
  // Note: We need to handle the 'role' field in the admins table which defaults to 'admin'
  const adminData = {
    ...admin,
    role: 'admin'
  };
  return createUser(adminData, 'admins');
};

export const updateAdmin = async (id, updates) => {
  try {
    const updatesToApply = { ...updates };
    if (!updatesToApply.password) {
      delete updatesToApply.password;
    }

    const { data, error } = await supabase
      .from('admins')
      .update(updatesToApply)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update admin');
    }

    return data;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'update admin');
  }
};

export const deleteAdmin = async (id) => {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, 'delete admin');
    }

    return true;
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'delete admin');
  }
};

// ============================================================================
// SYSTEM
// ============================================================================
export const clearAllData = async () => {
  try {
    console.log('Starting to clear all data...');

    // 1. Clear Auth Users (if admin client is available)
    if (adminSupabase) {
      try {
        console.log('Fetching all auth users to delete...');
        const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();

        if (listError) {
          console.error('Failed to list users:', listError);
        } else if (users && users.length > 0) {
          console.log(`Found ${users.length} auth users. Deleting...`);
          // Delete users in parallel chunks to speed it up
          const deletePromises = users.map(user =>
            adminSupabase.auth.admin.deleteUser(user.id)
              .catch(e => console.error(`Failed to delete user ${user.id}:`, e))
          );
          await Promise.all(deletePromises);
          console.log('All auth users deleted.');
        }
      } catch (e) {
        console.error('Error clearing auth users:', e);
        // Continue to clear public tables even if auth clear fails
      }
    } else {
      console.warn('Admin Supabase client not available. Skipping Auth user deletion.');
    }

    // 2. Clear Public Tables
    // Delete in order of dependencies (child first, then parent)
    const tables = [
      'projects',
      'social_workers',
      'project_managers',
      'area_managers',
      'board_members',
      'blog_posts',
      'admins',
      'state_districts'
    ];

    for (const table of tables) {
      console.log(`Clearing table: ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .not('id', 'is', null); // Generic "delete all"

      if (error) {
        console.error(`Failed to clear table ${table}:`, error);
        throw error;
      }
    }

    console.log('All public tables cleared.');

    // 3. Re-create Default Admin
    console.log('Re-creating default admin...');

    // Create auth user first
    if (adminSupabase) {
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: 'admin@fbgl.org',
        password: 'admin@fbgl2024',
        email_confirm: true,
        user_metadata: {
          full_name: 'Super Admin',
          role: 'admin'
        }
      });

      if (authError) {
        console.error('Failed to create admin auth user:', authError);
        throw authError;
      }

      // Insert into admins table using admin client to bypass RLS
      const { error: insertError } = await adminSupabase
        .from('admins')
        .insert([{
          username: 'admin',
          email: 'admin@fbgl.org',
          password: 'admin@fbgl2024',
          name: 'Super Admin',
          role: 'admin',
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Failed to insert admin into database:', insertError);
        throw insertError;
      }

      console.log('Default admin restored successfully.');
    } else {
      console.error('Cannot restore admin: Admin Supabase client not available.');
      throw new Error('Admin client required to restore default admin');
    }

    return true;

  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'clear all data');
  }
};

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const loginUser = async (username, password) => {
  try {
    // 1. Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    });

    if (error) {
      handleSupabaseError(error, 'login');
    }

    // 2. Get user details from metadata
    const user = data.user;
    const role = user.user_metadata?.role || 'admin'; // Default to admin if no role

    // 3. Fetch the actual profile from the database to get the correct ID and other details
    // The auth user ID (UUID) is different from the table ID (BIGINT)
    let profile = null;
    let tableName = '';

    switch (role) {
      case 'area_manager':
        tableName = 'area_managers';
        break;
      case 'project_manager':
        tableName = 'project_managers';
        break;
      case 'social_worker':
        tableName = 'social_workers';
        break;
      default:
        // For admin or unknown roles, we might not have a profile table or it's the admins table
        // If it's the super admin, we just return the auth data
        return {
          email: user.email,
          role: role,
          name: user.user_metadata?.full_name || 'Admin',
          id: user.id
        };
    }

    if (tableName) {
      // Try to find the profile by email
      const { data: profileData, error: profileError } = await supabase
        .from(tableName)
        .select('*')
        .eq('email', user.email)
        .single();

      if (!profileError && profileData) {
        profile = profileData;
      }
    }

    return {
      email: user.email,
      role: role,
      name: user.user_metadata?.full_name || (profile ? profile.name : 'User'),
      id: profile ? profile.id : user.id, // Use the table ID if available, otherwise auth ID
      ...profile // Include all other profile fields
    };
  } catch (error) {
    if (error instanceof ConnectionError) {
      throw error;
    }
    handleSupabaseError(error, 'login');
  }
};

// SITE SETTINGS
// ============================================================================
export const getSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "Row not found" error
      handleSupabaseError(error, 'fetch site settings');
    }

    // Default settings if not found
    return data || { id: 1, show_all_projects_on_home: false };
  } catch (error) {
    handleSupabaseError(error, 'fetch site settings');
  }
};

export const updateSiteSettings = async (settings) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...settings })
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update site settings');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'update site settings');
  }
};

// PROJECTS - Show on Home Toggle
// ============================================================================
export const toggleProjectHomeStatus = async (projectId, showOnHome) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ show_on_home: showOnHome })
      .eq('id', projectId)
      .select();

    if (error) {
      handleSupabaseError(error, 'toggle project home status');
    }

    return data?.[0] || null;
  } catch (error) {
    handleSupabaseError(error, 'toggle project home status');
  }
};

export const getHomePageProjects = async () => {
  try {
    // First check site settings
    const settings = await getSiteSettings();

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // Only filter by show_on_home if global toggle is OFF
    if (!settings?.show_all_projects_on_home) {
      query = query.eq('show_on_home', true);
    }

    const { data, error } = await query;

    if (error) {
      handleSupabaseError(error, 'fetch home page projects');
    }

    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'fetch home page projects');
  }
};

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

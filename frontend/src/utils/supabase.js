import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const getAreaManagers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'area_manager')
    .order('id_no', { ascending: true });

  if (error) {
    console.error('Error fetching area managers:', error);
    return null;
  }
  return data;
};

export const getProjectManagers = async (areaManagerId) => {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'project_manager');

  if (areaManagerId) {
    query = query.eq('area_manager_id', areaManagerId);
  }

  const { data, error } = await query.order('id_no', { ascending: true });

  if (error) {
    console.error('Error fetching project managers:', error);
    return null;
  }
  return data;
};

export const getSocialWorkers = async (projectManagerId) => {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'social_worker');

  if (projectManagerId) {
    query = query.eq('project_manager_id', projectManagerId);
  }

  const { data, error } = await query.order('id_no', { ascending: true });

  if (error) {
    console.error('Error fetching social workers:', error);
    return null;
  }
  return data;
};

export const getProjects = async (arg = {}) => {
  let query = supabase.from('projects').select('*');

  // Handle both object filters (new usage) and direct ID (legacy usage)
  if (typeof arg === 'object' && arg !== null) {
    if (arg.socialWorkerId) {
      query = query.eq('social_worker_id', arg.socialWorkerId);
    }
  } else if (arg) {
    // Assume it's a socialWorkerId passed directly
    query = query.eq('social_worker_id', arg);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
  return data;
};

export const getBoardMembers = async () => {
  const { data, error } = await supabase
    .from('board_members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching board members:', error);
    return null;
  }
  return data;
};

export const getProfileById = async (type, id) => {
  const roleMap = {
    'area_manager': 'area_manager',
    'project_manager': 'project_manager',
    'social_worker': 'social_worker',
    'board_member': 'board_member'
  };

  const role = roleMap[type];
  if (!role) return null;

  // Board members are still in their own table
  if (type === 'board_member') {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      return null;
    }
    return data;
  }

  // All other roles are in profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
  return data;
};

export const getProfileByIdNo = async (type, idNo) => {
  const roleMap = {
    'area_manager': 'area_manager',
    'project_manager': 'project_manager',
    'social_worker': 'social_worker',
    'board_member': 'board_member'
  };

  const role = roleMap[type];
  if (!role) return null;

  // Normalize id_no for comparison (remove spaces and convert to uppercase)
  const normalizedIdNo = idNo.replace(/\s+/g, '').toUpperCase();

  // Board members are still in their own table
  if (type === 'board_member') {
    const { data, error } = await supabase
      .from('board_members')
      .select('*');

    if (error) {
      console.error(`Error fetching ${type} by id_no:`, error);
      return null;
    }

    const profile = data?.find(p => {
      const profileIdNo = (p.id_no || '').replace(/\s+/g, '').toUpperCase();
      return profileIdNo === normalizedIdNo;
    });

    return profile || null;
  }

  // Get all records from profiles table with role filter
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role);

  if (error) {
    console.error(`Error fetching ${type} by id_no:`, error);
    return null;
  }

  // Find matching profile by comparing normalized id_no
  const profile = data?.find(p => {
    const profileIdNo = (p.id_no || '').replace(/\s+/g, '').toUpperCase();
    return profileIdNo === normalizedIdNo;
  });

  return profile || null;
};

export const getProjectManagersByAreaManagerIdNo = async (areaManagerIdNo) => {
  // First get the area manager by id_no
  const areaManager = await getProfileByIdNo('area_manager', areaManagerIdNo);
  if (!areaManager) return null;

  // Then get project managers by area_manager_id
  return getProjectManagers(areaManager.id);
};

export const getSocialWorkersByProjectManagerIdNo = async (projectManagerIdNo) => {
  // First get the project manager by id_no
  const projectManager = await getProfileByIdNo('project_manager', projectManagerIdNo);
  if (!projectManager) return null;

  // Then get social workers by project_manager_id
  return getSocialWorkers(projectManager.id);
};


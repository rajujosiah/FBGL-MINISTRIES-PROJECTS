import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const getAreaManagers = async () => {
  const { data, error } = await supabase
    .from('area_managers')
    .select('*')
    .order('id_no', { ascending: true });
  
  if (error) {
    console.error('Error fetching area managers:', error);
    return null;
  }
  return data;
};

export const getProjectManagers = async (areaManagerId) => {
  const { data, error } = await supabase
    .from('project_managers')
    .select('*')
    .eq('area_manager_id', areaManagerId)
    .order('id_no', { ascending: true });
  
  if (error) {
    console.error('Error fetching project managers:', error);
    return null;
  }
  return data;
};

export const getSocialWorkers = async (projectManagerId) => {
  const { data, error } = await supabase
    .from('social_workers')
    .select('*')
    .eq('project_manager_id', projectManagerId)
    .order('id_no', { ascending: true });
  
  if (error) {
    console.error('Error fetching social workers:', error);
    return null;
  }
  return data;
};

export const getProjects = async (socialWorkerId = null) => {
  let query = supabase.from('projects').select('*');
  
  if (socialWorkerId) {
    query = query.eq('social_worker_id', socialWorkerId);
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
  const tableMap = {
    'area_manager': 'area_managers',
    'project_manager': 'project_managers',
    'social_worker': 'social_workers',
    'board_member': 'board_members'
  };
  
  const table = tableMap[type];
  if (!table) return null;
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
  return data;
};

export const getProfileByIdNo = async (type, idNo) => {
  const tableMap = {
    'area_manager': 'area_managers',
    'project_manager': 'project_managers',
    'social_worker': 'social_workers',
    'board_member': 'board_members'
  };
  
  const table = tableMap[type];
  if (!table) return null;
  
  // Normalize id_no for comparison (remove spaces and convert to uppercase)
  const normalizedIdNo = idNo.replace(/\s+/g, '').toUpperCase();
  
  // Get all records and filter by normalized id_no (since Supabase doesn't support regex replace in queries)
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
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


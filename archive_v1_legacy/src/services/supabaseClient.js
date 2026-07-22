import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  PROJECTS: 'projects',
  BLOG_POSTS: 'blog_posts',
  DONATIONS: 'donations',
  ACCESS_CONTROL: 'access_control'
}

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  AREA_MANAGER: 'area_manager',
  PROJECT_MANAGER: 'project_manager',
  SOCIAL_WORKER: 'social_worker'
}

// Project categories
export const PROJECT_CATEGORIES = {
  SOCIAL: 'social',
  ECONOMIC: 'economic',
  EDUCATIONAL: 'educational'
}

// Project status
export const PROJECT_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  UPCOMING: 'upcoming'
}

-- Add area_manager_id column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS area_manager_id BIGINT REFERENCES area_managers(id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_projects_area_manager_id ON projects(area_manager_id);

-- Notify that the schema cache should be reloaded (Supabase handles this automatically on DDL execution)

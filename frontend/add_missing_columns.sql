-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS social_worker_id BIGINT REFERENCES social_workers(id),
ADD COLUMN IF NOT EXISTS project_manager_id BIGINT REFERENCES project_managers(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_social_worker_id ON projects(social_worker_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_manager_id ON projects(project_manager_id);

-- Ensure RLS policies cover these new columns (already covered by "ALL" policy, but good to verify)
-- No changes needed to policies if they are "FOR ALL USING (true)"

-- Add show_on_home column to projects table
ALTER TABLE projects 
ADD COLUMN show_on_home BOOLEAN DEFAULT FALSE;

-- Add an index for better performance
CREATE INDEX idx_projects_show_on_home ON projects(show_on_home) WHERE show_on_home = TRUE;

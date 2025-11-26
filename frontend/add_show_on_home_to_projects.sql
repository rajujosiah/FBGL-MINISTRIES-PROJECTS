-- Safely add show_on_home column to projects table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'show_on_home') THEN
        ALTER TABLE projects ADD COLUMN show_on_home BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Safely add index for better performance (drops if exists first to ensure correct definition)
DROP INDEX IF EXISTS idx_projects_show_on_home;
CREATE INDEX idx_projects_show_on_home ON projects(show_on_home) WHERE show_on_home = TRUE;

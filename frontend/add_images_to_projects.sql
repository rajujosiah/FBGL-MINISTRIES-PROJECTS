-- Add images column to projects table if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Force schema cache reload (sometimes needed)
NOTIFY pgrst, 'reload config';

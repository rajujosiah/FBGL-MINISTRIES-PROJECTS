-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  show_all_projects_on_home BOOLEAN DEFAULT FALSE,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row if it doesn't exist
INSERT INTO site_settings (id, show_all_projects_on_home)
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so Home page can read it)
CREATE POLICY "Allow public read access" ON site_settings
FOR SELECT USING (true);

-- Allow authenticated users (admins) to update
CREATE POLICY "Allow admin update" ON site_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

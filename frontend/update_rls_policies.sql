-- Enable RLS on all tables
ALTER TABLE area_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations for anon on area_managers" ON area_managers;
DROP POLICY IF EXISTS "Allow all operations for anon on project_managers" ON project_managers;
DROP POLICY IF EXISTS "Allow all operations for anon on social_workers" ON social_workers;
DROP POLICY IF EXISTS "Allow all operations for anon on projects" ON projects;
DROP POLICY IF EXISTS "Allow all operations for anon on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow all operations for anon on state_districts" ON state_districts;
DROP POLICY IF EXISTS "Allow all operations for anon on board_members" ON board_members;

-- Create policies to allow all operations for anon users
-- This is necessary because the admin user is currently client-side only
-- and requests are made using the anon key.

-- Area Managers
CREATE POLICY "Allow all operations for anon on area_managers"
ON area_managers FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Project Managers
CREATE POLICY "Allow all operations for anon on project_managers"
ON project_managers FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Social Workers
CREATE POLICY "Allow all operations for anon on social_workers"
ON social_workers FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Projects
CREATE POLICY "Allow all operations for anon on projects"
ON projects FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Blog Posts
CREATE POLICY "Allow all operations for anon on blog_posts"
ON blog_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- State Districts
CREATE POLICY "Allow all operations for anon on state_districts"
ON state_districts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Board Members
CREATE POLICY "Allow all operations for anon on board_members"
ON board_members FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Drop existing policies on projects table
DROP POLICY IF EXISTS "Allow all operations for anon on projects" ON projects;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on projects" ON projects;

-- Create a policy that allows ALL operations for both 'anon' and 'authenticated' users
CREATE POLICY "Allow all operations for everyone on projects"
ON projects FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Reload schema cache
NOTIFY pgrst, 'reload config';

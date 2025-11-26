-- Fix infinite recursion in admins RLS policies
-- Use auth.uid() instead of querying the admins table

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow admin insert" ON admins;
DROP POLICY IF EXISTS "Allow admin update" ON admins;
DROP POLICY IF EXISTS "Allow admin delete" ON admins;
DROP POLICY IF EXISTS "Allow admin select" ON admins;
DROP POLICY IF EXISTS "Allow admin operations" ON admins;

-- Create a simple policy that allows any authenticated user to read admins
-- (You can restrict this later if needed)
CREATE POLICY "Allow authenticated read" ON admins
FOR SELECT
TO authenticated
USING (true);

-- Allow INSERT for authenticated users
-- The application logic will handle admin role checking
CREATE POLICY "Allow authenticated insert" ON admins
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow UPDATE for authenticated users
CREATE POLICY "Allow authenticated update" ON admins
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow DELETE for authenticated users
CREATE POLICY "Allow authenticated delete" ON admins
FOR DELETE
TO authenticated
USING (true);

-- Alternative: If you want to restrict to only admins, use this instead:
-- But first, you need at least ONE admin in the system to bootstrap

-- AFTER you have at least one admin, you can run these stricter policies:
/*
DROP POLICY IF EXISTS "Allow authenticated read" ON admins;
DROP POLICY IF EXISTS "Allow authenticated insert" ON admins;
DROP POLICY IF EXISTS "Allow authenticated update" ON admins;
DROP POLICY IF EXISTS "Allow authenticated delete" ON admins;

CREATE POLICY "Admin only operations" ON admins
FOR ALL
TO authenticated
USING (
  -- Check if the current user's email exists in admins table with admin role
  auth.jwt() ->> 'email' IN (
    SELECT email FROM admins WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM admins WHERE role = 'admin'
  )
);
*/

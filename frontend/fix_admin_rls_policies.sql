-- Fix RLS policies for admins table to allow admin creation
-- This allows authenticated users with admin role to insert new admins

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admin insert" ON admins;
DROP POLICY IF EXISTS "Allow admin operations" ON admins;

-- Create policy to allow admins to insert new admin records
CREATE POLICY "Allow admin insert" ON admins
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if the user performing the insert is an admin
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.role = 'admin'
  )
);

-- Create policy to allow admins to update admin records
CREATE POLICY "Allow admin update" ON admins
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.role = 'admin'
  )
);

-- Create policy to allow admins to delete admin records
CREATE POLICY "Allow admin delete" ON admins
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.role = 'admin'
  )
);

-- Ensure SELECT policy exists
DROP POLICY IF EXISTS "Allow admin select" ON admins;
CREATE POLICY "Allow admin select" ON admins
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
    AND admins.role = 'admin'
  )
);

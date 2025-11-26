-- Fix RLS policies for site_settings table

-- First, drop existing policies to ensure a clean slate and avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update" ON site_settings;
DROP POLICY IF EXISTS "Allow admin all" ON site_settings;

-- Re-create "Allow public read access" policy (unchanged)
CREATE POLICY "Allow public read access" ON site_settings
FOR SELECT USING (true);

-- Create a comprehensive "Allow admin all" policy
-- This grants SELECT, INSERT, UPDATE, DELETE permissions to authenticated users
-- INSERT is crucial for the 'upsert' operation to work correctly
CREATE POLICY "Allow admin all" ON site_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Verify the fix by selecting (optional, just to see it works)
SELECT * FROM site_settings;

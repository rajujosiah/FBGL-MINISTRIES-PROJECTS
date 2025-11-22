-- Fix RLS policies for board_members table to allow delete operations

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Allow public read access" ON board_members;
DROP POLICY IF EXISTS "Allow authenticated full access" ON board_members;
DROP POLICY IF EXISTS "Allow authenticated insert" ON board_members;
DROP POLICY IF EXISTS "Allow authenticated update" ON board_members;
DROP POLICY IF EXISTS "Allow authenticated delete" ON board_members;

-- Create new policies with explicit permissions
CREATE POLICY "Allow public read access" ON board_members
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON board_members
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON board_members
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON board_members
  FOR DELETE 
  USING (auth.role() = 'authenticated');

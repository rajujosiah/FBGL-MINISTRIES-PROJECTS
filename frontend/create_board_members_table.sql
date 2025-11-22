-- Create board_members table
CREATE TABLE IF NOT EXISTS board_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON board_members
  FOR SELECT USING (true);

-- Allow all access to authenticated users (admins)
CREATE POLICY "Allow authenticated full access" ON board_members
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for board member photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('board-members', 'board-members', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to board-members bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'board-members');

-- Allow authenticated users to upload to board-members bucket
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'board-members' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete in board-members bucket
CREATE POLICY "Authenticated Update/Delete" ON storage.objects
  FOR UPDATE USING (bucket_id = 'board-members' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'board-members' AND auth.role() = 'authenticated');

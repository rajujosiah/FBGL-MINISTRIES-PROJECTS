-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL, -- Storing plain text as per current app design (should be hashed in production)
  email VARCHAR(100),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if any
DROP POLICY IF EXISTS "Allow all operations for anon on admins" ON admins;

-- Create policy to allow all operations for anon users (for development/client-side auth)
CREATE POLICY "Allow all operations for anon on admins"
ON admins FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Insert default admin user
INSERT INTO admins (username, password, email, name, role)
VALUES ('admin', 'admin@fbgl2024', 'admin@fbgl.org', 'Super Admin', 'admin')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password;

-- Output the credentials (this will be visible in the Supabase query results)
SELECT username, password, email, role FROM admins WHERE username = 'admin';

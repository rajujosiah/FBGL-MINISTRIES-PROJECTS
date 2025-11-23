-- DANGER: This script will delete ALL data from your tables.
-- It preserves the table structure (columns, types, etc.).

-- 1. Truncate all public tables
-- We use CASCADE to handle foreign key constraints automatically.
-- RESTART IDENTITY resets the auto-incrementing IDs back to 1.
TRUNCATE TABLE 
  projects, 
  social_workers, 
  project_managers, 
  area_managers, 
  board_members, 
  blog_posts, 
  state_districts,
  admins
  RESTART IDENTITY CASCADE;

-- 2. Instructions for Auth Users
-- This script cannot delete users from the 'auth.users' table because of permission restrictions in the SQL Editor.
-- To clear the "Users data" completely:
-- 1. Go to your Supabase Dashboard.
-- 2. Click on "Authentication" in the left sidebar.
-- 3. Go to the "Users" section.
-- 4. Select all users and delete them.

-- 3. After clearing data, you may want to re-insert the default admin:
INSERT INTO admins (username, password, email, name, role)
VALUES ('admin', 'admin@fbgl2024', 'admin@fbgl.org', 'Super Admin', 'admin');

-- Note: You will also need to Sign Up this admin user in the Authentication tab 
-- with the email 'admin@fbgl.org' and password 'admin@fbgl2024' (or whatever you prefer)
-- to be able to log in, as the previous Auth user was deleted.

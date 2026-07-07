-- Drop dedicated tables as all data is now in profiles table
-- WARNING: Ensure all data has been migrated/verified before running this script

-- Step 1: Drop the tables with CASCADE to remove foreign key constraints
DROP TABLE IF EXISTS area_managers CASCADE;
DROP TABLE IF EXISTS project_managers CASCADE;
DROP TABLE IF EXISTS social_workers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS board_members CASCADE;
DROP TABLE IF EXISTS access_control CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS donations CASCADE;

-- Step 2: Verify tables are gone (optional, just listing remaining tables)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

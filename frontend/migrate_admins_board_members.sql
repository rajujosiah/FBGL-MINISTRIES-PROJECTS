-- Migrate Admins and Board Members to Profiles Table
-- This script moves data from dedicated tables to the central profiles table

-- 0. Update role check constraint to allow 'admin' and 'board_member'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('area_manager', 'project_manager', 'social_worker', 'admin', 'board_member'));

-- 0.1 Ensure position column exists (required for Board Members)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- 0.2 Drop foreign key constraint to allow profiles without auth users (e.g. Board Members)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 1. Migrate Admins
-- We need to link admins to their auth.users accounts to get the correct UUID
INSERT INTO public.profiles (id, name, email, role, state_code, district_code, created_at)
SELECT 
    au.id, -- Get the UUID from auth.users
    COALESCE(a.email, au.email) as name, -- Use email as name fallback
    a.email, 
    'admin',
    'KA', -- Default state_code
    'BLR', -- Default district_code
    a.created_at
FROM public.admins a
JOIN auth.users au ON a.email = au.email
ON CONFLICT (id) DO NOTHING;

-- 2. Migrate Board Members
-- Board members might not have auth accounts, so we generate a new UUID for them
INSERT INTO public.profiles (id, name, role, position, bio, profile_picture, state_code, district_code, created_at)
SELECT 
    gen_random_uuid(), -- Generate a new UUID
    name, 
    'board_member', 
    position, 
    bio, 
    profile_picture,
    'KA', -- Default state_code
    'BLR', -- Default district_code
    created_at
FROM public.board_members
ON CONFLICT (id) DO NOTHING;

-- 3. Verify Migration
SELECT role, COUNT(*) as count FROM profiles GROUP BY role;

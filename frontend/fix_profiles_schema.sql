-- Fix Profiles Schema (Final Fix)
-- Since source tables (admins, board_members) are already dropped, we just ensure the profiles table structure is correct.

-- 1. Ensure all necessary columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_code TEXT DEFAULT 'KA';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district_code TEXT DEFAULT 'BLR';

-- 2. Update role check constraint to allow all roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('area_manager', 'project_manager', 'social_worker', 'admin', 'board_member'));

-- 3. Drop foreign key constraint to allow profiles without auth users (required for Board Members)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 4. Verify Schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

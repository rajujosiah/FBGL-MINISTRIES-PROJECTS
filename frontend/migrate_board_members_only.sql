-- Migrate Board Members Only (Safe Script)
-- Use this if the 'admins' table has already been dropped but 'board_members' still exists.

-- 1. Ensure columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- 2. Update role check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('area_manager', 'project_manager', 'social_worker', 'admin', 'board_member'));

-- 3. Drop foreign key constraint (required for Board Members without auth users)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 4. Migrate Board Members
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

-- 5. Verify
SELECT role, COUNT(*) as count FROM profiles WHERE role = 'board_member' GROUP BY role;

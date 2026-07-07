-- Fix Admin Usernames
-- Since the 'admins' table is already dropped, we cannot recover the original usernames.
-- We will add the column and populate it using the email address as a fallback.

-- 1. Ensure username column exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- 2. Populate username from email for Admins (if username is null)
-- This takes the part before '@' from the email to use as a username
UPDATE public.profiles
SET username = split_part(email, '@', 1)
WHERE role = 'admin' AND username IS NULL;

-- 3. Verify
SELECT email, username FROM profiles WHERE role = 'admin';

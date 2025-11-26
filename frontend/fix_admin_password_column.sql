-- Remove NOT NULL constraint from password column in admins table
-- Password is stored in Supabase Auth, not in the admins table

-- Make password column nullable
ALTER TABLE admins 
ALTER COLUMN password DROP NOT NULL;

-- Optionally, you can remove the password column entirely since it's not used
-- (Uncomment if you want to remove it completely)
-- ALTER TABLE admins DROP COLUMN password;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'admins' 
AND column_name = 'password';

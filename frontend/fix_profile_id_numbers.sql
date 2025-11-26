-- Fix profiles table to use Supabase Auth user ID instead of TEMP IDs
-- This updates existing TEMP IDs and sets up a trigger for future inserts

-- Step 1: Update existing TEMP IDs to use the actual auth user ID
UPDATE profiles
SET id_number = id::text
WHERE id_number LIKE 'TEMP-%';

-- Step 2: Create or replace function to auto-set id_number from auth id
CREATE OR REPLACE FUNCTION set_id_number_from_auth_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If id_number is NULL or starts with TEMP, set it to the auth user id
  IF NEW.id_number IS NULL OR NEW.id_number LIKE 'TEMP-%' THEN
    NEW.id_number := NEW.id::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger to automatically set id_number on insert/update
DROP TRIGGER IF EXISTS set_id_number_trigger ON profiles;
CREATE TRIGGER set_id_number_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_id_number_from_auth_id();

-- Verify the changes
SELECT id, name, id_number 
FROM profiles 
WHERE id_number NOT LIKE 'TEMP-%'
ORDER BY name;

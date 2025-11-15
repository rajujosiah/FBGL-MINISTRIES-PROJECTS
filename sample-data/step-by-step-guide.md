# 🔧 **SOLUTION: Fix Foreign Key Constraint Error**

## ❌ **The Problem**
You're getting this error because:
- The `profiles` table has a foreign key constraint to `auth.users`
- You're trying to insert profiles with random UUIDs
- Those UUIDs don't exist in the `auth.users` table

## ✅ **The Solution**

### **Step 1: Create Users in Authentication First**

1. **Go to Supabase Dashboard**
   - Navigate to **Authentication** → **Users**
   - Click **"Add user"** for each team member

2. **Create These Users:**
   ```
   Email: admin@fbglministries.org
   Password: [create strong password]
   
   Email: sarah.johnson@fbglministries.org
   Password: [create strong password]
   
   Email: michael.chen@fbglministries.org
   Password: [create strong password]
   
   Email: priya.sharma@fbglministries.org
   Password: [create strong password]
   
   Email: david.wilson@fbglministries.org
   Password: [create strong password]
   
   Email: maria.garcia@fbglministries.org
   Password: [create strong password]
   
   Email: robert.brown@fbglministries.org
   Password: [create strong password]
   
   Email: lisa.anderson@fbglministries.org
   Password: [create strong password]
   ```

### **Step 2: Copy the User IDs**

After creating users, **copy their UUIDs** from the Users table. They'll look like:
- `12345678-1234-1234-1234-123456789abc`
- `22345678-1234-1234-1234-123456789abc`
- etc.

### **Step 3: Update the CSV File**

1. **Open** `profiles-fixed.csv`
2. **Replace** all the placeholder IDs:
   - `REPLACE-WITH-ADMIN-USER-ID` → Your actual admin user ID
   - `REPLACE-WITH-AREA-MANAGER-1-ID` → Your actual area manager 1 ID
   - `REPLACE-WITH-PROJECT-MANAGER-1-ID` → Your actual project manager 1 ID
   - etc.

### **Step 4: Import the Fixed Data**

1. **Go to Table Editor** → **profiles**
2. **Click Import** and upload the updated CSV
3. **Map columns correctly**
4. **Click Import**

## 🚀 **Alternative: Use SQL Commands**

If you prefer SQL, use this approach:

```sql
-- First, get the user IDs from auth.users
SELECT id, email FROM auth.users;

-- Then insert profiles with the actual user IDs
INSERT INTO profiles (
  id, 
  name, 
  role, 
  state_code, 
  district_code, 
  id_number,
  can_edit_profile,
  can_add_projects,
  can_manage_team
) VALUES (
  'YOUR-ACTUAL-USER-ID-HERE',  -- Replace with real UUID from auth.users
  'Admin User',
  'admin',
  'AP',
  'EG',
  'FBGL-AP-EG-ADMIN-01',
  true,
  true,
  true
);
```

## 📋 **Quick Checklist**

- [ ] Create 8 users in Authentication
- [ ] Copy their UUIDs
- [ ] Update the CSV file with real UUIDs
- [ ] Import the profiles
- [ ] Import other tables (projects, blog_posts, etc.)

## 🎯 **Why This Happens**

The `profiles` table is designed to extend Supabase's built-in `auth.users` table. This is a common pattern where:
- `auth.users` handles authentication (login, password, etc.)
- `profiles` stores additional user information (role, permissions, etc.)
- The `id` in `profiles` must match an existing `id` in `auth.users`

## ✅ **After Fixing**

Once you have the profiles imported, you can:
1. Import the projects (they reference profile IDs)
2. Import blog posts (they reference author IDs)
3. Import donations and contact messages
4. Import access control settings

Your ministry website will then have complete, realistic data! 🎉


# FBGL Ministries - Sample Data for Supabase

This directory contains CSV files with sample data for all tables in the FBGL Ministries database.

## 📁 Files Included

### 1. **profiles.csv** - Team Members
- **8 team members** with different roles (admin, area_manager, project_manager, social_worker)
- **Hierarchical structure** with assigned_to relationships
- **Complete contact information** (phone, email, address)
- **Permission settings** for each role

### 2. **projects.csv** - Ministry Projects
- **10 diverse projects** across all categories (social, economic, educational)
- **Different statuses** (ongoing, completed, upcoming)
- **Realistic project details** with locations and beneficiaries
- **Assigned to project managers**

### 3. **blog_posts.csv** - Blog Articles
- **8 blog posts** covering different ministry activities
- **Written by different team members**
- **Realistic content** about ministry work and impact

### 4. **donations.csv** - Donation Records
- **15 donation records** with various amounts
- **Different payment methods** (bank_transfer, paypal, cash)
- **Realistic transaction IDs**
- **Total amount: ₹67,400**

### 5. **contact_messages.csv** - Contact Form Submissions
- **10 contact messages** from potential volunteers and donors
- **Realistic inquiries** about programs and partnerships
- **Various contact reasons**

### 6. **access_control.csv** - User Permissions
- **Permission settings** for all team members
- **Role-based access control** implementation

## 🚀 How to Import Data into Supabase

### Method 1: Using Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project

2. **Import Each Table**
   - Go to **Table Editor**
   - Select the table (e.g., `profiles`)
   - Click **Import** button
   - Upload the corresponding CSV file
   - Map columns correctly
   - Click **Import**

3. **Import Order** (Important!)
   ```
   1. profiles.csv (first - other tables reference it)
   2. projects.csv
   3. blog_posts.csv
   4. donations.csv
   5. contact_messages.csv
   6. access_control.csv (last - references profiles)
   ```

### Method 2: Using SQL Commands

1. **Go to SQL Editor** in Supabase Dashboard
2. **Copy and paste** the SQL commands below:

```sql
-- Import profiles (replace with actual UUIDs from your auth.users table)
INSERT INTO profiles (id, name, id_number, role, state_code, district_code, address, phone, email, aadhar_no, assigned_to, is_active, can_edit_profile, can_add_projects, can_manage_team, created_at, updated_at) VALUES
('12345678-1234-1234-1234-123456789abc', 'Rev. Dr. John Smith', 'FBGL-AP-EG-ADMIN-01', 'admin', 'AP', 'EG', '123 Main Street, East Godavari, Andhra Pradesh', '+91-9876543210', 'admin@fbglministries.org', '123456789012', null, true, true, true, true, '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
-- ... (continue with all profiles)

-- Import projects
INSERT INTO projects (id, title, description, category, location, area_of_operation, target_beneficiaries, status, images_base64, assigned_to, created_at, updated_at) VALUES
('proj-001', 'Community Health Awareness Program', 'A comprehensive health awareness program...', 'social', 'East Godavari District', 'Rural villages in East Godavari', '500+ families in 10 villages', 'ongoing', '[]', '32345678-1234-1234-1234-123456789abc', '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
-- ... (continue with all projects)

-- Continue with other tables...
```

## ⚠️ Important Notes

### 1. **UUID Requirements**
- **Replace UUIDs** in profiles.csv with actual user IDs from your `auth.users` table
- **Generate new UUIDs** for projects and other records if needed

### 2. **Data Relationships**
- **profiles** table is referenced by other tables
- **assigned_to** field links team members hierarchically
- **author_id** in blog_posts references profiles
- **assigned_to** in projects references profiles

### 3. **Permission Settings**
- **Admin**: Full permissions (edit, add projects, manage team)
- **Area Manager**: Can edit profile and add projects
- **Project Manager**: Can edit profile only
- **Social Worker**: Read-only access

## 🎯 Sample Data Overview

### **Team Structure**
```
Admin (Rev. Dr. John Smith)
├── Area Manager (Sarah Johnson)
│   └── Project Manager (Michael Chen)
│       ├── Social Worker (Priya Sharma)
│       └── Social Worker (David Wilson)
└── Area Manager (Maria Garcia)
    └── Project Manager (Robert Brown)
        └── Social Worker (Lisa Anderson)
```

### **Project Categories**
- **Social**: Health awareness, senior care, disaster relief, mental health
- **Economic**: Women's entrepreneurship, agricultural training, vocational skills
- **Educational**: Digital literacy, children's education, scholarship program

### **Donation Summary**
- **Total Amount**: ₹67,400
- **Payment Methods**: Bank transfer, PayPal, Cash
- **Donor Types**: Individual, corporate, community groups

## 🔧 Customization

### **Modify Data**
- **Update contact information** with real details
- **Change project locations** to your service areas
- **Adjust donation amounts** based on your needs
- **Add more team members** as needed

### **Add More Records**
- **Duplicate existing entries** and modify details
- **Maintain relationships** between tables
- **Follow the same format** for consistency

## 📊 Data Validation

After importing, verify:
- ✅ All profiles have correct role assignments
- ✅ Projects are assigned to valid team members
- ✅ Blog posts have valid author references
- ✅ Donations have realistic amounts and methods
- ✅ Contact messages are properly formatted

## 🆘 Troubleshooting

### **Common Issues**
1. **UUID Mismatch**: Ensure profile IDs match auth.users
2. **Foreign Key Errors**: Import in correct order
3. **Date Format**: Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
4. **Empty Fields**: Use null for optional fields

### **Need Help?**
- Check Supabase documentation
- Verify table schemas match CSV headers
- Ensure all required fields are populated
- Test with small batches first

---

**Ready to populate your ministry database with realistic, comprehensive data!** 🎉


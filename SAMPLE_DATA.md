# Sample Data for FBGL Ministry Website

This document explains how to populate your Supabase database with sample data for testing and demonstration purposes.

## 🚀 Quick Start

### Option 1: Using the Admin Interface (Recommended)

1. Start your development server: `npm start`
2. Navigate to `/admin/sample-data` (you'll need admin access)
3. Click "Populate Data" to add sample data
4. Use the provided login credentials to test different user roles

### Option 2: Using the Command Line Script

1. Set your Supabase environment variables:
   ```bash
   export REACT_APP_SUPABASE_URL="your_supabase_url"
   export REACT_APP_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

2. Run the sample data script:
   ```bash
   node populate-sample-data.js
   ```

## 📊 Sample Data Included

### 👥 Users (5 total)
- **1 Admin**: `admin@fbglministry.org` / `admin123`
- **2 Area Managers**: 
  - `area.manager.ap@fbglministry.org` / `area123`
  - `area.manager.ts@fbglministry.org` / `area123`
- **1 Project Manager**: `project.manager.ap@fbglministry.org` / `project123`
- **1 Social Worker**: `social.worker.ap@fbglministry.org` / `social123`

### 🎯 Projects (4 total)
- **Educational Projects**:
  - Rural Education Support Program
  - Digital Literacy Program
- **Economic Projects**:
  - Women Empowerment Initiative
- **Social Projects**:
  - Community Health Awareness Program

### 📝 Blog Posts & Events (3 total)
- FBGL Ministry Annual Report 2024
- Upcoming: Community Health Camp
- Success Story: Women Empowerment Program

### 💰 Donations (3 total)
- 2 Completed donations
- 1 Pending donation
- Various categories: general, education, health

## 🔧 Features

### Sample Data Manager Interface
- **Populate Data**: Adds all sample data to your database
- **Clear Data**: Removes all data (use with caution!)
- **Information Cards**: Shows what data will be added
- **Login Credentials**: Displays all test user credentials

### Data Structure
All sample data follows the proper FBGL ID format:
- **Area Managers**: `FBGL-[STATE]-[DISTRICT]-A01`
- **Project Managers**: `FBGL-[STATE]-[DISTRICT]-P01`
- **Social Workers**: `FBGL-[STATE]-[DISTRICT]-S01`

### Hierarchical Relationships
- Area Managers oversee Project Managers
- Project Managers oversee Social Workers
- Projects are assigned to specific managers
- Blog posts are authored by team members

## 🧪 Testing Scenarios

### 1. Admin Testing
- Login as `admin@fbglministry.org`
- Access all admin features
- Manage team members, projects, and content
- Test access control functionality

### 2. Manager Testing
- Login as Area Manager or Project Manager
- View assigned team members
- Manage projects under your jurisdiction
- Test role-based permissions

### 3. Social Worker Testing
- Login as Social Worker
- View assigned projects
- Update project status
- Test limited access features

### 4. Public Interface Testing
- Browse team members (hierarchical navigation)
- View projects with filters
- Test donation functionality
- Check blog posts and events

## 🗑️ Clearing Data

### Using Admin Interface
1. Go to `/admin/sample-data`
2. Click "Clear All Data"
3. Confirm the action

### Using Command Line
```bash
# Clear all data (be careful!)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
(async () => {
  await supabase.from('donations').delete().neq('id', 0);
  await supabase.from('blog_posts').delete().neq('id', 0);
  await supabase.from('projects').delete().neq('id', 0);
  await supabase.from('profiles').delete().neq('id', 0);
  console.log('All data cleared!');
})();
"
```

## 🔒 Security Notes

- Sample data uses test credentials - change passwords in production
- Aadhaar numbers are fictional for testing purposes
- Phone numbers and addresses are sample data
- All images are placeholder SVG data URIs

## 📱 Mobile Testing

The sample data works well for testing responsive design:
- Team member cards display properly on mobile
- Project grids adapt to different screen sizes
- Admin interfaces are mobile-friendly
- Dashboard layouts are responsive

## 🚀 Production Deployment

Before deploying to production:
1. Clear all sample data
2. Create real admin accounts
3. Add real team members
4. Upload actual project images
5. Configure real payment gateways

## 📞 Support

If you encounter issues with sample data:
1. Check your Supabase connection
2. Verify environment variables
3. Check browser console for errors
4. Ensure RLS policies allow data insertion

---

**Note**: This sample data is designed for development and testing purposes only. Do not use in production environments.


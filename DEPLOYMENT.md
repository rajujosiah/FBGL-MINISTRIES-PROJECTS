# FBGL Ministry Website - Deployment Guide

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
3. **PayPal Developer Account**: For payment integration (optional)
4. **GitHub Account**: For code repository

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `fbgl-ministry-website`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 1.2 Get Supabase Credentials
1. Go to Project Settings → API
2. Copy the following:
   - Project URL (e.g., `https://your-project.supabase.co`)   https://znylowwttgxfqxkbikqp.supabase.co
   - Anon/Public Key (starts with `eyJ...`)   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueWxvd3d0dGd4ZnF4a2Jpa3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzMyNDIsImV4cCI6MjA3NjgwOTI0Mn0.KwW4SCjQUhi6OEOey3IXOV0jHqAJ-zvcDmZEAqHchcg

### 1.3 Create Database Tables
1. Go to SQL Editor in your Supabase dashboard
2. Run the following SQL commands:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  profile_picture_base64 TEXT,
  id_number TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'area_manager', 'project_manager', 'social_worker')),
  state_code TEXT NOT NULL,
  district_code TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  aadhar_no TEXT,
  assigned_to UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  can_edit_profile BOOLEAN DEFAULT false,
  can_add_projects BOOLEAN DEFAULT false,
  can_manage_team BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('social', 'economic', 'educational')),
  location TEXT,
  area_of_operation TEXT,
  target_beneficiaries TEXT,
  status TEXT NOT NULL CHECK (status IN ('ongoing', 'completed', 'upcoming')),
  images_base64 JSONB,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  images_base64 JSONB,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  amount DECIMAL(10,2),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create access_control table
CREATE TABLE access_control (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  can_edit_profile BOOLEAN DEFAULT false,
  can_add_projects BOOLEAN DEFAULT false,
  can_manage_team BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.4 Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_control ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for projects table
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their projects" ON projects
  FOR ALL USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for blog_posts table
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for contact_messages table
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for donations table
CREATE POLICY "Admins can manage donations" ON donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for access_control table
CREATE POLICY "Admins can manage access control" ON access_control
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 1.5 Create Admin User
1. Go to Authentication → Users in Supabase dashboard
2. Click "Add user"
3. Enter admin email and password
4. After user is created, go to SQL Editor and run:

```sql
-- Insert admin profile
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
  'your-admin-user-id-here',
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

## Step 2: PayPal Donation Setup (Optional)

### 2.1 Create PayPal Donation Button
1. Go to [paypal.com](https://paypal.com) and sign in
2. Go to "Tools" → "All Tools" → "PayPal Buttons"
3. Click "Create Button"
4. Choose "Donate" button type
5. Set your organization name and donation amounts
6. Copy the generated button code or link
7. Replace `YOUR_BUTTON_ID` in the Donate.js file with your actual button ID

## Step 3: Vercel Deployment

### 3.1 Prepare Repository
1. Initialize git repository:
   ```bash
   cd fbgl-ministry-website
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repository:
   - Go to GitHub.com
   - Click "New repository"
   - Name: `fbgl-ministry-website`
   - Make it public or private
   - Don't initialize with README
   - Click "Create repository"

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/fbgl-ministry-website.git
   git branch -M main
   git push -u origin main
   ```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Create React App
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 3.3 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```
REACT_APP_SUPABASE_URL = https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY = your-anon-key-here
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your site will be available at `https://your-project.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Test the Website
1. Visit your deployed website
2. Test all public pages (Home, Team, Projects, Contact, Donate)
3. Test login functionality with admin credentials
4. Test admin dashboard features

### 4.2 Add Sample Data
1. Login as admin
2. Add some team members
3. Create sample projects
4. Add blog posts
5. Test the hierarchical navigation

### 4.3 Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## Step 5: Maintenance

### 5.1 Regular Backups
- Supabase automatically backs up your database
- Consider exporting data periodically

### 5.2 Monitoring
- Monitor Vercel analytics for performance
- Check Supabase logs for any issues
- Monitor donation transactions

### 5.3 Updates
- Keep dependencies updated
- Test updates in development first
- Deploy updates through Vercel

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables exist

3. **Authentication Issues**
   - Check Supabase auth settings
   - Verify user roles are set correctly
   - Check RLS policies for profiles table

4. **Image Upload Issues**
   - Check image compression settings
   - Verify base64 conversion
   - Check database column types

### Support
- Check Supabase documentation
- Check Vercel documentation
- Contact development team for assistance

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **RLS Policies**: Regularly review and update security policies
3. **User Permissions**: Regularly audit user access levels
4. **Data Privacy**: Ensure compliance with data protection regulations
5. **Backup Strategy**: Implement regular data backups

## Performance Optimization

1. **Image Optimization**: Images are automatically compressed
2. **Database Indexing**: Add indexes for frequently queried columns
3. **Caching**: Vercel provides automatic caching
4. **CDN**: Vercel provides global CDN for static assets

## Cost Management

1. **Supabase**: Free tier includes 500MB database and 2GB bandwidth
2. **Vercel**: Free tier includes 100GB bandwidth and unlimited static sites
3. **PayPal**: Transaction fees apply for donations
4. **Monitoring**: Set up alerts for usage limits

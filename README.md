# FBGL Ministry Website

A comprehensive React website for FIRST BORN GOSPEL LIFE MINISTRIES with role-based access control, team management, and project tracking.

## Features

### Public Features
- **Home Page**: Hero section, ministry overview, focus areas, testimonials
- **Team Page**: Hierarchical team navigation (Area Managers → Project Managers → Social Workers)
- **Projects Page**: Filterable project gallery with detailed views
- **Contact Page**: Contact form with Google Maps integration
- **Donate Page**: PayPal integration and bank transfer options

### Admin Features
- **Admin Dashboard**: Overview of ministry statistics and recent activity
- **Team Management**: Add/edit team members with auto-generated FBGL IDs
- **Access Control**: Manage user permissions and roles
- **Blog & Events**: Content management for ministry updates

### Role-Based Dashboards
- **Area Managers**: Manage Project Managers and view hierarchy
- **Project Managers**: Manage Social Workers and projects
- **Social Workers**: Manage their assigned projects

## Technology Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel
- **Payment**: PayPal integration
- **Image Storage**: Base64 compression and storage

## ID System

Team members are assigned unique IDs in the format:
`FBGL-[STATE]-[DISTRICT]-[ROLE]-[COUNT]`

Example: `FBGL-AP-EG-A01` (Andhra Pradesh, East Godavari, Area Manager, 1st)

## Setup Instructions

### 1. Environment Setup

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

### 2. Supabase Database Setup

Create the following tables in your Supabase project:

#### profiles table
```sql
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
```

#### projects table
```sql
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
```

#### blog_posts table
```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  images_base64 JSONB,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### donations table
```sql
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  amount DECIMAL(10,2),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### contact_messages table
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies for role-based access.

### 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 5. Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
│   ├── admin/          # Admin-only pages
│   └── dashboard/      # Role-based dashboards
├── context/            # React context providers
├── services/           # API services (Supabase)
├── utils/              # Utility functions
└── App.js              # Main app component
```

## Key Features

### Image Compression
- Automatic image compression before base64 conversion
- Maximum file size: 500KB per image
- Supports multiple image formats

### ID Generation
- Automatic FBGL ID generation based on state, district, and role
- Sequential numbering per role per district
- Unique constraint enforcement

### Role-Based Access
- Admin: Full access to all features
- Area Manager: Manage Project Managers and view hierarchy
- Project Manager: Manage Social Workers and projects
- Social Worker: Manage assigned projects only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to FIRST BORN GOSPEL LIFE MINISTRIES.

## Support

For technical support, contact the development team at Kingdom Creative Media.
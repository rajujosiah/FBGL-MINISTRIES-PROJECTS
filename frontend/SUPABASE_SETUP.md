# Supabase Database Setup

This document provides instructions for setting up the Supabase database for the FIRST BORN GOSPEL LIFE MINISTRIES website.

## Database Tables

Create the following tables in your Supabase project:

### 1. Board Members Table
```sql
CREATE TABLE board_members (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_picture TEXT, -- Base64 or URL
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Area Managers Table
```sql
CREATE TABLE area_managers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  id_no VARCHAR(50) UNIQUE NOT NULL, -- Format: FBGL [STATE] [DISTRICT] A[COUNT]
  profile_picture TEXT, -- Base64 or URL
  area_manager VARCHAR(255) NOT NULL, -- Area name
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  aadhaar_no VARCHAR(20),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Project Managers Table
```sql
CREATE TABLE project_managers (
  id BIGSERIAL PRIMARY KEY,
  area_manager_id BIGINT REFERENCES area_managers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  id_no VARCHAR(50) UNIQUE NOT NULL, -- Format: FBGL [STATE] [DISTRICT] P[COUNT]
  profile_picture TEXT, -- Base64 or URL
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  aadhaar_no VARCHAR(20),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Social Workers Table
```sql
CREATE TABLE social_workers (
  id BIGSERIAL PRIMARY KEY,
  project_manager_id BIGINT REFERENCES project_managers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  id_no VARCHAR(50) UNIQUE NOT NULL, -- Format: FBGL [STATE] [DISTRICT] S[COUNT]
  profile_picture TEXT, -- Base64 or URL
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  aadhaar_no VARCHAR(20),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Projects Table
```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  social_worker_id BIGINT REFERENCES social_workers(id) ON DELETE SET NULL,
  project_manager_id BIGINT REFERENCES project_managers(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- 'social', 'economy', 'education'
  area_of_operation VARCHAR(255),
  location TEXT,
  target_beneficiaries TEXT,
  status VARCHAR(50) DEFAULT 'upcoming', -- 'ongoing', 'completed', 'upcoming'
  images TEXT[], -- Array of Base64 strings or URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

Enable RLS and create policies for public read access:

```sql
-- Enable RLS on all tables
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for board_members" ON board_members FOR SELECT USING (true);
CREATE POLICY "Public read access for area_managers" ON area_managers FOR SELECT USING (true);
CREATE POLICY "Public read access for project_managers" ON project_managers FOR SELECT USING (true);
CREATE POLICY "Public read access for social_workers" ON social_workers FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);

-- Add password column to tables (Run this if tables already exist)
ALTER TABLE area_managers ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE project_managers ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE social_workers ADD COLUMN IF NOT EXISTS password VARCHAR(255);
```

## Sample Data

You can insert sample data using the scripts provided in `src/utils/sampleData.js` as reference.

## Image Storage

For image storage, you can either:
1. Store Base64 encoded images directly in the database (simple but not recommended for large images)
2. Use Supabase Storage buckets for images and store URLs in the database (recommended)

To use Supabase Storage:
1. Create a storage bucket named "profile-pictures" or "project-images"
2. Upload images via Supabase Storage API
3. Store the public URL in the database

## Environment Variables

Create a `.env` file in the `frontend` directory:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase project settings under API.



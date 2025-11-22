-- Comprehensive script to fix blog_posts table schema
-- Adds all columns that might be missing to prevent further errors

-- 1. Add 'published' column (Boolean, default true)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

-- 2. Add 'updated_at' column (Timestamp)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Ensure other columns exist (just in case previous scripts weren't run)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON blog_posts(updated_at);

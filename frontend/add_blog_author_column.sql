-- Add missing author column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin';

-- Add index for potential filtering by author
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);

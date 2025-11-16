import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPosts, initializeData } from '../utils/dataManager';
import './Blog.css';

const Blog = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const posts = getBlogPosts();
    // Sort by date, newest first
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    setBlogPosts(sortedPosts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="loading">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <h1>Our Blog</h1>
        <p className="blog-subtitle">
          Latest news, updates, and stories from FIRST BORN GOSPEL LIFE MINISTRIES
        </p>

        {blogPosts.length > 0 ? (
          <div className="blog-posts-container">
            {blogPosts.map(post => (
              <article 
                key={post.id} 
                className="blog-post-full"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {post.featured_image && (
                  <div className="blog-post-featured-image">
                    <img src={post.featured_image} alt={post.title} />
                  </div>
                )}
                <div className="blog-post-full-content">
                  <h2 className="blog-card-title-only">{post.title}</h2>
                  <button className="blog-read-more-card-btn" onClick={(e) => { e.stopPropagation(); navigate(`/blog/${post.id}`); }}>
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-blog-posts">
            <p>No blog posts available yet. Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;


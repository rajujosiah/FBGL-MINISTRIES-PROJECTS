import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPosts, getBlogPostById, initializeData } from '../utils/dataManager';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadPost = async () => {
      try {
        await initializeData();
        // Use dedicated function to fetch single post
        // Check if ID is purely numeric (for integer IDs) or string (for UUIDs)
        const isNumeric = /^\d+$/.test(id);
        const postId = isNumeric ? parseInt(id) : id;
        const foundPost = await getBlogPostById(postId);

        if (foundPost) {
          setPost(foundPost);
        } else {
          console.error('Blog post not found for id:', id);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handlePreviousImage = () => {
    if (!post?.images || post.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!post?.images || post.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="loading">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Blog Post Not Found</h2>
            <button onClick={() => navigate('/blog')} className="btn-primary">
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="container">
        <button onClick={() => navigate('/blog')} className="back-button">
          ← Back to Blog
        </button>

        <article className="blog-detail">
          {post.featured_image && (
            <div className="blog-detail-featured-image">
              <img src={post.featured_image} alt={post.title} />
            </div>
          )}

          <div className="blog-detail-content">
            <header className="blog-detail-header">
              <h1>{post.title}</h1>
              <div className="blog-detail-meta">
                <span className="blog-author">By {post.author || 'Admin'}</span>
                <span className="blog-separator">•</span>
                <span className="blog-date">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </header>

            {post.excerpt && (
              <div className="blog-detail-excerpt">
                <p>{post.excerpt}</p>
              </div>
            )}

            <div className="blog-detail-body">
              {post.content.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Check if it's a heading (starts with #)
                if (trimmed.startsWith('#')) {
                  const level = trimmed.match(/^#+/)?.[0].length || 1;
                  const text = trimmed.replace(/^#+\s*/, '');
                  const HeadingTag = `h${Math.min(level, 6)}`;
                  return React.createElement(HeadingTag, { key: index, className: 'blog-heading' }, text);
                }

                // Regular paragraph
                return <p key={index} className="blog-paragraph">{trimmed}</p>;
              })}
            </div>

            {post.images && post.images.length > 0 && (
              <div className="blog-detail-carousel">
                <h2>Photo Gallery</h2>
                <div className="carousel-container">
                  <button
                    className="carousel-nav carousel-prev"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <div className="carousel-main">
                    <img
                      src={post.images[currentImageIndex]}
                      alt={`${post.title} - Image ${currentImageIndex + 1}`}
                      className="carousel-main-image"
                    />
                    <div className="carousel-counter">
                      {currentImageIndex + 1} / {post.images.length}
                    </div>
                  </div>

                  <button
                    className="carousel-nav carousel-next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>

                {post.images.length > 1 && (
                  <div className="carousel-thumbnails">
                    {post.images.map((img, index) => (
                      <div
                        key={index}
                        className={`carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => handleImageClick(index)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;



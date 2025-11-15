import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { compressImageToBase64 } from '../../utils/imageCompression';
import { Plus, Edit, Trash2, Eye, Upload, X, Calendar } from 'lucide-react';
import '../../styles/pages/admin.css';

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_at: new Date().toISOString().split('T')[0]
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(files);
      const previews = await Promise.all(
        files.map(file => compressImageToBase64(file, 300))
      );
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const postData = {
        ...formData,
        images_base64: imagePreviews,
        author_id: 'current-user-id', // Replace with actual user ID
        created_at: new Date().toISOString()
      };

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        published_at: new Date().toISOString().split('T')[0]
      });
      setImages([]);
      setImagePreviews([]);
      setShowForm(false);
      setEditingPost(null);

      // Refresh data
      await fetchBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setImagePreviews(post.images_base64 || []);
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      await fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Blog & Events Management</h1>
            <p className="admin-subtitle">Manage blog posts and upcoming events</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="admin-add-btn"
          >
            <Plus className="admin-add-icon" />
            Add New Post
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="admin-blog-grid">
          {blogPosts.map((post) => (
            <div key={post.id} className="admin-blog-card">
              {/* Post Image */}
              <div className="admin-blog-image">
                {post.images_base64 && post.images_base64.length > 0 ? (
                  <img
                    src={post.images_base64[0]}
                    alt={post.title}
                    className="admin-blog-img"
                  />
                ) : (
                  <div className="admin-blog-no-image">
                    <span className="admin-blog-no-image-text">No Image</span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="admin-blog-content">
                <h3 className="admin-blog-title">
                  {post.title}
                </h3>
                <p className="admin-blog-description">
                  {post.content}
                </p>
                <div className="admin-blog-date">
                  <Calendar className="admin-blog-date-icon" />
                  {new Date(post.published_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="admin-blog-actions">
                  <button
                    onClick={() => handleEdit(post)}
                    className="admin-blog-edit-btn"
                  >
                    <Edit className="admin-blog-action-icon" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="admin-blog-delete-btn"
                  >
                    <Trash2 className="admin-blog-action-icon" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <Eye className="admin-empty-icon-svg" />
            </div>
            <h3 className="admin-empty-title">No blog posts yet</h3>
            <p className="admin-empty-description">Create your first blog post to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="admin-empty-btn"
            >
              Create First Post
            </button>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="admin-modal-overlay">
            <div className="admin-modal admin-modal-large">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      setFormData({
                        title: '',
                        content: '',
                        published_at: new Date().toISOString().split('T')[0]
                      });
                      setImagePreviews([]);
                    }}
                    className="admin-modal-close"
                  >
                    <X className="admin-modal-close-icon" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                  {/* Title */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter blog post title"
                    />
                  </div>

                  {/* Content */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      rows={8}
                      required
                      value={formData.content}
                      onChange={handleInputChange}
                      className="admin-form-textarea"
                      placeholder="Write your blog post content here..."
                    />
                  </div>

                  {/* Images */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="admin-file-input"
                      id="blog-images"
                    />
                    <label
                      htmlFor="blog-images"
                      className="admin-upload-btn"
                    >
                      <Upload className="admin-upload-icon" />
                      Upload Images
                    </label>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="admin-image-previews">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="admin-image-preview-item">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="admin-image-preview-img"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Publish Date */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      name="published_at"
                      value={formData.published_at}
                      onChange={handleInputChange}
                      className="admin-form-input"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="admin-form-actions">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="admin-form-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="admin-form-submit"
                    >
                      {submitting ? 'Saving...' : (editingPost ? 'Update' : 'Publish')} Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;

import React, { useState, useEffect } from 'react';
import { IoMdImages } from 'react-icons/io';
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, ConnectionError as DataConnectionError } from '../../utils/dataManager';
import { convertFileToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import ConnectionError from '../ConnectionError';
import './AdminComponents.css';

const BlogManagement = ({ onUpdate }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setConnectionError(null);
      const posts = await getBlogPosts();
      setBlogPosts(Array.isArray(posts) ? posts : []);
    } catch (error) {
      if (error instanceof DataConnectionError) {
        setConnectionError(error.message);
      } else {
        setConnectionError('Failed to load blog posts. Please check your internet connection.');
      }
      setBlogPosts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      setConnectionError(null);
      // Ensure images array is properly formatted
      const imagesToSave = Array.isArray(formData.images) ? formData.images : (formData.images ? [formData.images] : []);

      const postData = {
        ...formData,
        images: imagesToSave // Ensure it's always an array with all images
      };

      if (selectedPost) {
        // When updating, ensure we preserve all existing images
        const existingPost = blogPosts.find(p => p.id === selectedPost.id);
        if (existingPost && existingPost.images) {
          // Merge existing images with form images (form images might have new ones added)
          const existingImages = Array.isArray(existingPost.images) ? existingPost.images : [];

          // Use formData.images which already includes all images (existing + newly added)
          // The formData should have all images when editing because handleEdit loads them
          postData.images = imagesToSave; // Use the complete list from form
        }

        await updateBlogPost(selectedPost.id, {
          ...postData,
          updated_at: new Date().toISOString()
        });
      } else {
        await addBlogPost({
          ...postData,
          author: 'Admin',
          created_at: new Date().toISOString()
        });
      }

      setShowForm(false);
      setFormData({ title: '', content: '', excerpt: '', featured_image: '', images: [] });
      setSelectedPost(null);
      await loadBlogPosts();
      onUpdate?.();

      alert(selectedPost ? 'Blog post updated successfully with all images!' : 'Blog post created successfully!');
    } catch (error) {
      console.error('Error saving blog post:', error);
      if (error instanceof DataConnectionError) {
        // Check for timeout or payload size issues
        if (error.message.includes('timeout') || error.message.includes('payload')) {
          setConnectionError('The request timed out. This usually happens when uploading too many large images. Please try reducing the number of images or their quality.');
        } else {
          setConnectionError(error.message);
        }
      } else {
        setConnectionError('Failed to save blog post. Please check your internet connection or try uploading fewer images.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e, type = 'featured') => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      setUploading(true);
      const compressedImage = await compressImage(file);

      if (type === 'featured') {
        setFormData({ ...formData, featured_image: compressedImage });
      } else {
        setFormData({ ...formData, images: [...formData.images, compressedImage] });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    // Ensure images array is properly loaded
    const existingImages = Array.isArray(post.images) ? post.images : (post.images ? [post.images] : []);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      images: existingImages // Load all existing images
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setConnectionError(null);
        await deleteBlogPost(id);
        await loadBlogPosts();
        onUpdate?.();
      } catch (error) {
        if (error instanceof DataConnectionError) {
          setConnectionError(error.message);
        } else {
          setConnectionError('Failed to delete blog post. Please check your internet connection.');
        }
      }
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="manage-section">
      {connectionError && (
        <ConnectionError
          message={connectionError}
          onRetry={loadBlogPosts}
        />
      )}

      <div className="section-header">
        <h2>Blog Management</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); setSelectedPost(null); }}>
          + Create Blog Post
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content blog-form-content">
            <div className="form-modal-header">
              <h3>{selectedPost ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
              <button className="close-btn" onClick={() => { setShowForm(false); setSelectedPost(null); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Blog post title"
                />
              </div>

              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows="2"
                  placeholder="Short description of the blog post"
                />
              </div>

              <div className="form-group">
                <label>Featured Image</label>
                {formData.featured_image && (
                  <div className="image-preview">
                    <img src={formData.featured_image} alt="Featured" />
                    <button type="button" onClick={() => setFormData({ ...formData, featured_image: '' })}>Remove</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'featured')}
                  disabled={uploading}
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="15"
                  required
                  placeholder="Write your blog post content here. You can use line breaks for paragraphs."
                  className="blog-content-editor"
                />
              </div>

              <div className="form-group">
                <label>Photo Gallery (Bulk Upload)</label>
                <p className="field-hint">
                  Select multiple images at once for the photo gallery. Supported formats: JPG, PNG, GIF, WEBP. Max 5MB per image.
                </p>
                {formData.images.length > 0 && (
                  <div className="images-grid">
                    {formData.images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img} alt={`Image ${index + 1}`} />
                        <button type="button" onClick={() => removeImage(index)}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bulk-upload-section">
                  <label htmlFor="bulk-image-upload" className="bulk-upload-label">
                    <IoMdImages className="bulk-upload-icon" />
                    <div className="bulk-upload-text">
                      <strong>Click to Upload Multiple Photos</strong>
                      <span>Select one or more images (up to 20 at once)</span>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="images-count-display">
                        {formData.images.length} {formData.images.length === 1 ? 'Photo' : 'Photos'} Added
                      </div>
                    )}
                  </label>
                  <input
                    id="bulk-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;

                      if (files.length > 20) {
                        alert('Maximum 20 images can be uploaded at once. Please select fewer images.');
                        e.target.value = '';
                        return;
                      }

                      setUploading(true);
                      const validImages = [];
                      const skippedFiles = [];

                      try {
                        for (const file of files) {
                          const validation = validateImageFile(file);
                          if (validation.valid) {
                            try {
                              const compressedImage = await compressImage(file);
                              validImages.push(compressedImage);
                            } catch (error) {
                              console.error('Error compressing image:', error);
                              skippedFiles.push({ name: file.name, reason: 'Compression failed' });
                            }
                          } else {
                            skippedFiles.push({ name: file.name, reason: validation.error });
                          }
                        }

                        if (validImages.length > 0) {
                          // Ensure formData.images is an array before spreading
                          const currentImages = Array.isArray(formData.images) ? formData.images : [];
                          const updatedImages = [...currentImages, ...validImages];

                          setFormData({
                            ...formData,
                            images: updatedImages
                          });

                          if (skippedFiles.length > 0) {
                            alert(`Successfully uploaded ${validImages.length} image(s)!\n\n${skippedFiles.length} file(s) skipped:\n${skippedFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n')}`);
                          } else {
                            alert(`Successfully uploaded ${validImages.length} image(s)!`);
                          }
                        } else {
                          alert(`No images could be uploaded.\n\nIssues found:\n${skippedFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n')}`);
                        }
                      } catch (error) {
                        console.error('Error during bulk upload:', error);
                        alert('An error occurred during upload. Please try again.');
                      } finally {
                        setUploading(false);
                        // Reset input to allow selecting same files again
                        e.target.value = '';
                      }
                    }}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  {uploading && (
                    <div className="upload-progress">
                      <p>Processing images... Please wait.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Saving...' : selectedPost ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setSelectedPost(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="blog-posts-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-post-card">
            {post.featured_image && (
              <div className="blog-post-image">
                <img src={post.featured_image} alt={post.title} />
              </div>
            )}
            <div className="blog-post-content">
              <h3>{post.title}</h3>
              {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}
              <p className="blog-post-meta">
                Created: {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div className="blog-post-actions">
                <button className="btn-small btn-secondary" onClick={() => handleEdit(post)}>
                  Edit
                </button>
                <button className="btn-small btn-danger" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogPosts.length === 0 && (
        <p className="empty-state">No blog posts found. Create one to get started.</p>
      )}
    </div>
  );
};

export default BlogManagement;


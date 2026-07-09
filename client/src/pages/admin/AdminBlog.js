import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const BLOG_CATEGORIES = ['gemstone-energy', 'collection-story', 'symbolism', 'styling', 'history', 'craftsmanship'];

const defaultForm = { title: '', slug: '', excerpt: '', content: '', category: 'gemstone-energy', isPublished: false, isFeatured: false };

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchPosts = () => {
    setLoading(true);
    // Get all posts including unpublished (admin)
    api.get('/blog?limit=50').then(({ data }) => setPosts(data.posts)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/blog/${editId}`, form);
      else await api.post('/blog', form);
      toast.success(editId ? 'Post updated' : 'Post created');
      setShowForm(false); setEditId(null); setForm(defaultForm);
      fetchPosts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (post) => { setEditId(post._id); setForm(post); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/blog/${id}`);
    toast.success('Post deleted'); fetchPosts();
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo"><Link to="/">LUMARIS</Link><span>Admin</span></div>
        <nav className="admin-sidebar__nav">
          {[{ to: '/admin', l: 'Dashboard' }, { to: '/admin/orders', l: 'Orders' }, { to: '/admin/products', l: 'Products' }, { to: '/admin/collections', l: 'Collections' }, { to: '/admin/gemstones', l: 'Gemstones' }, { to: '/admin/customers', l: 'Customers' }, { to: '/admin/blog', l: 'Blog' }]
            .map(i => <Link key={i.to} to={i.to} className="admin-nav-link"><span>{i.l}</span></Link>)}
        </nav>
        <div className="admin-sidebar__footer"><Link to="/" className="admin-nav-link">← Back to Site</Link></div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header__title">Blog / Journal</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        </div>

        {showForm && (
          <div className="admin-card" style={{ marginBottom: 28 }}>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Title *</label><input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label">Slug *</label><input type="text" name="slug" className="form-input" value={form.slug} onChange={handleChange} required /></div>
              </div>
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Category</label>
                  <select name="category" className="form-input" value={form.category} onChange={handleChange}>
                    {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Excerpt</label><textarea name="excerpt" className="form-input" rows={2} value={form.excerpt} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Content *</label><textarea name="content" className="form-input" rows={12} value={form.content} onChange={handleChange} required /></div>
              <div className="admin-form__checkboxes">
                <label className="admin-checkbox"><input type="checkbox" name="isPublished" checked={!!form.isPublished} onChange={handleChange} /><span>Published</span></label>
                <label className="admin-checkbox"><input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} /><span>Featured</span></label>
              </div>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Post'}</button>
            </form>
          </div>
        )}

        <div className="admin-card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Category</th><th>Views</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td style={{ fontFamily: 'var(--font-serif)', fontSize: 15 }}>{post.title}</td>
                    <td style={{ fontSize: 12, color: 'var(--champagne)', textTransform: 'capitalize' }}>{post.category?.replace('-', ' ')}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.views || 0}</td>
                    <td><span style={{ color: post.isPublished ? '#27AE60' : '#F39C12', fontSize: 12 }}>{post.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn-sm" onClick={() => handleEdit(post)}>Edit</button>
                        <button className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(post._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBlog;

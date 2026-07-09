import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const INSPIRATION_TYPES = ['person', 'city', 'literature', 'cinema', 'event', 'era', 'other'];

const defaultForm = {
  name: '', slug: '', subtitle: '', inspirationType: 'person', inspiration: '', era: '',
  storyIntroduction: '', historicalBackground: '', emotionalMeaning: '', gemstoneConnection: '',
  quote: '', quoteAuthor: '', isFeatured: false, sortOrder: 0
};

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchCollections = () => {
    setLoading(true);
    api.get('/collections')
      .then(({ data }) => setCollections(data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCollections(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/collections/${editId}`, form);
      else await api.post('/collections', form);
      toast.success(editId ? 'Collection updated' : 'Collection created');
      setShowForm(false); setEditId(null); setForm(defaultForm);
      fetchCollections();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (col) => { setEditId(col._id); setForm(col); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this collection?')) return;
    await api.delete(`/collections/${id}`);
    toast.success('Archived'); fetchCollections();
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
          <h1 className="admin-header__title">Collections</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
            {showForm ? 'Cancel' : '+ Add Collection'}
          </button>
        </div>

        {showForm && (
          <div className="admin-card" style={{ marginBottom: 28 }}>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Name *</label><input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label">Slug *</label><input type="text" name="slug" className="form-input" value={form.slug} onChange={handleChange} required /></div>
              </div>
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Inspiration Type</label>
                  <select name="inspirationType" className="form-input" value={form.inspirationType} onChange={handleChange}>
                    {INSPIRATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Inspiration (person/city/book...)</label><input type="text" name="inspiration" className="form-input" placeholder="e.g. Dante Alighieri" value={form.inspiration} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Era</label><input type="text" name="era" className="form-input" placeholder="e.g. Renaissance" value={form.era} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label className="form-label">Story Introduction *</label><textarea name="storyIntroduction" className="form-input" rows={4} value={form.storyIntroduction} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Historical Background</label><textarea name="historicalBackground" className="form-input" rows={3} value={form.historicalBackground} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Emotional Meaning</label><textarea name="emotionalMeaning" className="form-input" rows={3} value={form.emotionalMeaning} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Gemstone & Story Connection</label><textarea name="gemstoneConnection" className="form-input" rows={3} value={form.gemstoneConnection} onChange={handleChange} /></div>
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Quote</label><input type="text" name="quote" className="form-input" value={form.quote} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Quote Author</label><input type="text" name="quoteAuthor" className="form-input" value={form.quoteAuthor} onChange={handleChange} /></div>
              </div>
              <div className="admin-form__checkboxes">
                <label className="admin-checkbox"><input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} /><span>Featured</span></label>
              </div>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Collection'}</button>
            </form>
          </div>
        )}

        <div className="admin-card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Inspiration</th><th>Type</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col._id}>
                    <td style={{ fontFamily: 'var(--font-serif)', fontSize: 15 }}>{col.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{col.inspiration || '—'}</td>
                    <td style={{ textTransform: 'capitalize', fontSize: 12 }}>{col.inspirationType}</td>
                    <td>{col.isFeatured ? '✓' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn-sm" onClick={() => handleEdit(col)}>Edit</button>
                        <button className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(col._id)}>Archive</button>
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

export default AdminCollections;

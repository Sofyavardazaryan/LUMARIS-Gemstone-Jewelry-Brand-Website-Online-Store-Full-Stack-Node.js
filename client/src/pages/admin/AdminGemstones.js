import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const defaultForm = {
  name: '', slug: '', color: '', mohs: '', origin: '', description: '',
  geologicalBackground: '', symbolism: '', emotionalProperties: '',
  energeticProperties: '', spiritualAssociations: '', chakra: '',
  zodiacSign: '', planet: '', element: '', careInstructions: '',
  isFeatured: false
};

const AdminGemstones = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchGemstones = () => {
    setLoading(true);
    api.get('/gemstones').then(({ data }) => setGemstones(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchGemstones(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, zodiacSign: form.zodiacSign.split(',').map(s => s.trim()).filter(Boolean), mohs: Number(form.mohs) || undefined };
    try {
      if (editId) await api.put(`/gemstones/${editId}`, payload);
      else await api.post('/gemstones', payload);
      toast.success(editId ? 'Gemstone updated' : 'Gemstone added');
      setShowForm(false); setEditId(null); setForm(defaultForm);
      fetchGemstones();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (gem) => {
    setEditId(gem._id);
    setForm({ ...gem, zodiacSign: gem.zodiacSign?.join(', ') || '', mohs: gem.mohs || '' });
    setShowForm(true);
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
          <h1 className="admin-header__title">Gemstones Library</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
            {showForm ? 'Cancel' : '+ Add Gemstone'}
          </button>
        </div>

        {showForm && (
          <div className="admin-card" style={{ marginBottom: 28 }}>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Name *</label><input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label">Slug *</label><input type="text" name="slug" className="form-input" value={form.slug} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label">Color</label><input type="text" name="color" className="form-input" placeholder="Deep violet-purple" value={form.color} onChange={handleChange} /></div>
              </div>
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Mohs Hardness</label><input type="number" name="mohs" className="form-input" min="1" max="10" step="0.5" value={form.mohs} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Origin</label><input type="text" name="origin" className="form-input" placeholder="Brazil, Uruguay" value={form.origin} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Chakra</label><input type="text" name="chakra" className="form-input" placeholder="Crown, Third Eye" value={form.chakra} onChange={handleChange} /></div>
              </div>
              <div className="admin-form__row">
                <div className="form-group"><label className="form-label">Planet</label><input type="text" name="planet" className="form-input" value={form.planet} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Element</label><input type="text" name="element" className="form-input" value={form.element} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Zodiac Signs (comma-separated)</label><input type="text" name="zodiacSign" className="form-input" placeholder="Pisces, Virgo, Capricorn" value={form.zodiacSign} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description *</label><textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Energetic Properties * (Required)</label><textarea name="energeticProperties" className="form-input" rows={3} value={form.energeticProperties} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Emotional Properties</label><textarea name="emotionalProperties" className="form-input" rows={3} value={form.emotionalProperties} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Symbolism</label><textarea name="symbolism" className="form-input" rows={3} value={form.symbolism} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Spiritual Associations</label><textarea name="spiritualAssociations" className="form-input" rows={3} value={form.spiritualAssociations} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Geological Background</label><textarea name="geologicalBackground" className="form-input" rows={3} value={form.geologicalBackground} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Care Instructions</label><textarea name="careInstructions" className="form-input" rows={2} value={form.careInstructions} onChange={handleChange} /></div>
              <div className="admin-form__checkboxes">
                <label className="admin-checkbox"><input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} /><span>Featured on Homepage</span></label>
              </div>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Gemstone'}</button>
            </form>
          </div>
        )}

        <div className="admin-card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead><tr><th>Gemstone</th><th>Color</th><th>Chakra</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {gemstones.map(gem => (
                  <tr key={gem._id}>
                    <td style={{ fontFamily: 'var(--font-serif)', fontSize: 15 }}>{gem.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{gem.color || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--champagne)' }}>{gem.chakra || '—'}</td>
                    <td>{gem.isFeatured ? '✓' : '—'}</td>
                    <td>
                      <button className="admin-btn-sm" onClick={() => handleEdit(gem)}>Edit</button>
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

export default AdminGemstones;

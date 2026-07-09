import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const CATEGORIES = ['bracelets', 'necklaces', 'pendants', 'rings', 'earrings', 'sets'];

const defaultForm = {
  name: '', slug: '', category: 'bracelets', price: '', stock: 0,
  shortDescription: '', description: '', materials: '',
  energeticMeaning: '', careInstructions: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?limit=50${search ? `&search=${search}` : ''}`);
      setProducts(data.products);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      ...product,
      materials: product.materials?.join(', ') || '',
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      materials: form.materials.split(',').map(m => m.trim()).filter(Boolean),
    };
    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowForm(false);
      setEditId(null);
      setForm(defaultForm);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product archived');
      fetchProducts();
    } catch { toast.error('Could not archive product'); }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo"><Link to="/">LUMARIS</Link><span>Admin</span></div>
        <nav className="admin-sidebar__nav">
          {[
            { to: '/admin', label: 'Dashboard' }, { to: '/admin/orders', label: 'Orders' },
            { to: '/admin/products', label: 'Products' }, { to: '/admin/collections', label: 'Collections' },
            { to: '/admin/gemstones', label: 'Gemstones' }, { to: '/admin/customers', label: 'Customers' },
            { to: '/admin/blog', label: 'Blog' },
          ].map(item => <Link key={item.to} to={item.to} className="admin-nav-link"><span>{item.label}</span></Link>)}
        </nav>
        <div className="admin-sidebar__footer"><Link to="/" className="admin-nav-link">← Back to Site</Link></div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header__title">Products</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="admin-card" style={{ marginBottom: 28 }}>
            <div className="admin-card__header">
              <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug *</label>
                  <input type="text" name="slug" className="form-input" placeholder="product-url-slug" value={form.slug} onChange={handleChange} required />
                </div>
              </div>
              <div className="admin-form__row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-input" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input type="number" name="price" className="form-input" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock" className="form-input" min="0" value={form.stock} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input type="text" name="shortDescription" className="form-input" value={form.shortDescription} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Full Description (Storytelling) *</label>
                <textarea name="description" className="form-input" rows={5} value={form.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Materials (comma-separated)</label>
                <input type="text" name="materials" className="form-input" placeholder="Sterling Silver, Amethyst, 18K Gold Plating" value={form.materials} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gemstone Energy Description</label>
                <textarea name="energeticMeaning" className="form-input" rows={3} value={form.energeticMeaning} onChange={handleChange} />
              </div>
              <div className="admin-form__checkboxes">
                {[
                  { name: 'isFeatured', label: 'Featured' },
                  { name: 'isNewArrival', label: 'New Arrival' },
                  { name: 'isBestSeller', label: 'Best Seller' },
                ].map(cb => (
                  <label key={cb.name} className="admin-checkbox">
                    <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleChange} />
                    <span>{cb.label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Product'}</button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2>All Products ({products.length})</h2>
            <input type="text" placeholder="Search products..." className="form-input" style={{ width: 240 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="admin-table__product">
                        <div className="admin-table__product-img">{p.thumbnailImage ? <img src={p.thumbnailImage} alt={p.name} /> : '✦'}</div>
                        <div>
                          <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                    <td className="admin-table__amount">${p.price.toFixed(2)}</td>
                    <td>
                      <span style={{ color: p.stock === 0 ? '#E74C3C' : p.stock < 5 ? '#F39C12' : 'var(--text-secondary)' }}>{p.stock}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.isFeatured && <span className="admin-badge">Featured</span>}
                        {p.isNewArrival && <span className="admin-badge">New</span>}
                        {p.isBestSeller && <span className="admin-badge admin-badge--gold">Best</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(p._id)}>Archive</button>
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

export default AdminProducts;

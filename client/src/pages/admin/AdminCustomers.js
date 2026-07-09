import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 30, ...(search && { search }) });
    api.get(`/admin/customers?${params}`)
      .then(({ data }) => { setCustomers(data.customers); setTotal(data.total); })
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, [search]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/customers/${id}/status`, { isActive: !currentStatus });
      toast.success('Customer status updated');
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
    } catch { toast.error('Could not update status'); }
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
          <h1 className="admin-header__title">Customers ({total})</h1>
          <input type="text" placeholder="Search by name or email..." className="form-input" style={{ width: 280 }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="admin-card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead>
                <tr><th>Customer</th><th>Email</th><th>Joined</th><th>Last Login</th><th>Newsletter</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontFamily: 'var(--font-serif)', fontSize: 15 }}>{c.firstName} {c.lastName}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.lastLogin ? new Date(c.lastLogin).toLocaleDateString() : '—'}</td>
                    <td>{c.newsletterSubscribed ? '✓' : '—'}</td>
                    <td><span style={{ color: c.isActive ? '#27AE60' : '#E74C3C', fontSize: 12 }}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className={`admin-btn-sm ${c.isActive ? 'admin-btn-sm--danger' : ''}`} onClick={() => toggleStatus(c._id, c.isActive)}>
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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

export default AdminCustomers;

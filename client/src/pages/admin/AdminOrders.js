import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AdminPages.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(filterStatus && { status: filterStatus }) });
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Could not update status'); }
  };

  const AdminSidebar = () => (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo"><Link to="/">LUMARIS</Link><span>Admin</span></div>
      <nav className="admin-sidebar__nav">
        {[{ to: '/admin', l: 'Dashboard' }, { to: '/admin/orders', l: 'Orders' }, { to: '/admin/products', l: 'Products' }, { to: '/admin/collections', l: 'Collections' }, { to: '/admin/gemstones', l: 'Gemstones' }, { to: '/admin/customers', l: 'Customers' }, { to: '/admin/blog', l: 'Blog' }]
          .map(i => <Link key={i.to} to={i.to} className="admin-nav-link"><span>{i.l}</span></Link>)}
      </nav>
      <div className="admin-sidebar__footer"><Link to="/" className="admin-nav-link">← Back to Site</Link></div>
    </aside>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header__title">Orders ({total})</h1>
          <select className="form-input" style={{ width: 180 }} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="admin-card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ color: 'var(--champagne)', fontFamily: 'var(--font-serif)' }}>{order.orderNumber}</td>
                    <td>
                      <div>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.user?.email || order.guestEmail}</p>
                      </div>
                    </td>
                    <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="admin-table__amount">${order.totalAmount?.toFixed(2)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <span className={`admin-status admin-status--${order.status}`}>{order.isPaid ? '✓ Paid' : '✗ Unpaid'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div style={{ display: 'flex', gap: 8, padding: '20px 0 0', justifyContent: 'center' }}>
              {[...Array(pages)].map((_, i) => (
                <button key={i} className={`shop-pagination__btn ${page === i + 1 ? 'shop-pagination__btn--active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;

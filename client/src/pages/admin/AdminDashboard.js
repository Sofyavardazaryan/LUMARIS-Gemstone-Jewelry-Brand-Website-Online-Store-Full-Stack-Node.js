import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './AdminDashboard.css';

const StatCard = ({ label, value, sub, icon, trend }) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__info">
      <p className="stat-card__label">{label}</p>
      <h3 className="stat-card__value">{value}</h3>
      {sub && <p className="stat-card__sub">{sub}</p>}
      {trend !== undefined && (
        <p className={`stat-card__trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </p>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <Link to="/">LUMARIS</Link>
          <span>Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {[
            { to: '/admin', icon: '⊞', label: 'Dashboard' },
            { to: '/admin/orders', icon: '◻', label: 'Orders' },
            { to: '/admin/products', icon: '◆', label: 'Products' },
            { to: '/admin/collections', icon: '❋', label: 'Collections' },
            { to: '/admin/gemstones', icon: '✦', label: 'Gemstones' },
            { to: '/admin/customers', icon: '◈', label: 'Customers' },
            { to: '/admin/blog', icon: '✍', label: 'Blog' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="admin-nav-link">
              <span className="admin-nav-link__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-nav-link">← Back to Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header__title">Dashboard</h1>
          <p className="admin-header__date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="admin-stats-grid">
              <StatCard
                icon="$"
                label="Total Revenue"
                value={formatCurrency(data?.stats?.totalRevenue)}
                sub={`${formatCurrency(data?.stats?.monthRevenue)} this month`}
                trend={data?.stats?.revenueGrowth}
              />
              <StatCard icon="◻" label="Total Orders" value={data?.stats?.totalOrders?.toLocaleString()} sub={`${data?.stats?.monthOrders} this month`} />
              <StatCard icon="◈" label="Customers" value={data?.stats?.totalCustomers?.toLocaleString()} />
              <StatCard icon="◆" label="Active Products" value={data?.stats?.totalProducts?.toLocaleString()} />
            </div>

            {/* Pending alert */}
            {data?.stats?.pendingOrders > 0 && (
              <div className="admin-alert">
                <span>⚠ {data.stats.pendingOrders} order{data.stats.pendingOrders !== 1 ? 's' : ''} awaiting processing</span>
                <Link to="/admin/orders">View Orders →</Link>
              </div>
            )}

            <div className="admin-grid-2">
              {/* Recent Orders */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <h2>Recent Orders</h2>
                  <Link to="/admin/orders" className="admin-card__action">View All →</Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentOrders?.slice(0, 8).map(order => (
                      <tr key={order._id}>
                        <td><Link to={`/admin/orders`} className="admin-table__link">{order.orderNumber}</Link></td>
                        <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail || 'Guest'}</td>
                        <td className="admin-table__amount">{formatCurrency(order.totalAmount)}</td>
                        <td><span className={`admin-status admin-status--${order.status}`}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Products */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <h2>Top Products</h2>
                  <Link to="/admin/products" className="admin-card__action">Manage →</Link>
                </div>
                <div className="admin-top-products">
                  {data?.topProducts?.map((product, i) => (
                    <div key={product._id} className="admin-product-row">
                      <span className="admin-product-row__rank">#{i + 1}</span>
                      <div className="admin-product-row__img">
                        {product.thumbnailImage ? <img src={product.thumbnailImage} alt={product.name} /> : <div className="admin-product-row__placeholder">✦</div>}
                      </div>
                      <div className="admin-product-row__info">
                        <p className="admin-product-row__name">{product.name}</p>
                        {product.gemstone && <p className="admin-product-row__gem">{product.gemstone.name}</p>}
                      </div>
                      <div className="admin-product-row__stats">
                        <p className="admin-product-row__price">{formatCurrency(product.price)}</p>
                        <p className="admin-product-row__sold">{product.soldCount} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart (simplified bar chart using CSS) */}
            {data?.revenueByMonth?.length > 0 && (
              <div className="admin-card admin-chart-card">
                <div className="admin-card__header">
                  <h2>Revenue — Last 6 Months</h2>
                </div>
                <div className="admin-chart">
                  {data.revenueByMonth.map((item, i) => {
                    const maxRev = Math.max(...data.revenueByMonth.map(d => d.revenue));
                    const pct = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
                    const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' });
                    return (
                      <div key={i} className="admin-chart__bar-wrap">
                        <div className="admin-chart__bar" style={{ height: `${pct}%` }}>
                          <span className="admin-chart__bar-value">{formatCurrency(item.revenue)}</span>
                        </div>
                        <span className="admin-chart__label">{monthName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

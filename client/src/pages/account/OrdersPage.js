import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: '#F39C12', confirmed: '#3498DB', processing: '#8E44AD',
  shipped: '#1ABC9C', delivered: '#27AE60', cancelled: '#E74C3C', refunded: '#95A5A6'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page container">
      <div className="orders-page__header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border-medium)" strokeWidth="1">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>No orders yet</h3>
          <p>Start exploring our collections</p>
          <Link to="/shop" className="btn btn-outline">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-row">
              <div className="order-row__main">
                <div className="order-row__info">
                  <span className="order-row__number">{order.orderNumber}</span>
                  <span className="order-row__date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="order-row__items-preview">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <span key={i} className="order-row__item">{item.name}</span>
                  ))}
                  {order.items?.length > 3 && <span className="order-row__item-more">+{order.items.length - 3} more</span>}
                </div>
              </div>
              <div className="order-row__meta">
                <span className="order-row__status" style={{ color: STATUS_COLORS[order.status] || '#666' }}>
                  {order.status}
                </span>
                <span className="order-row__total">${order.totalAmount?.toFixed(2)}</span>
                <Link to={`/account/orders/${order._id}`} className="btn btn-ghost" style={{ padding: '8px 0' }}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

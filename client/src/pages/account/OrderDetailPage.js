import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-page"><div className="loading-page__logo">LUMARIS</div><div className="loading-page__spinner"/></div>;
  if (!order) return <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Order not found</h2><Link to="/account/orders" className="btn btn-outline" style={{ marginTop: 24 }}>My Orders</Link></div>;

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <Link to="/account/orders" style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--champagne)' }}>← All Orders</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 4 }}>Order {order.orderNumber}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span style={{ padding: '6px 16px', background: 'var(--ivory)', fontSize: 12, letterSpacing: 1, textTransform: 'capitalize', color: 'var(--champagne)', border: '1px solid var(--border-light)' }}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div style={{ background: 'white', border: '1px solid var(--border-light)', marginBottom: 24 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 24px', borderBottom: i < order.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
            <div style={{ width: 72, height: 72, background: 'var(--ivory)', flexShrink: 0 }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 4 }}>{item.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--champagne)' }}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Shipping */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'white', border: '1px solid var(--border-light)', padding: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 12 }}>Shipping Address</p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--border-light)', padding: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 12 }}>Order Total</p>
          {[
            { label: 'Subtotal', value: `$${order.subtotal?.toFixed(2)}` },
            { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}` },
            { label: 'Tax', value: `$${order.taxAmount?.toFixed(2)}` },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)' }}>
              <span>{row.label}</span><span>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'var(--font-serif)', fontSize: 18 }}>
            <span>Total</span><span style={{ color: 'var(--champagne)' }}>${order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

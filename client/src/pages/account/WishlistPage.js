import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/products/ProductCard';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/wishlist')
      .then(({ data }) => setWishlist(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 1100 }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 8 }}>My Wishlist</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 14 }}>{wishlist.length} saved piece{wishlist.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : wishlist.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border-medium)" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>No saved pieces yet</h3>
          <p>Click the heart icon on any product to save it here</p>
          <Link to="/shop" className="btn btn-outline">Explore the Collection</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {wishlist.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

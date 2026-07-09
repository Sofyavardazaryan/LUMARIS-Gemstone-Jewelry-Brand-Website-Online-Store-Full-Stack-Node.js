import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const StarRating = ({ rating }) => (
  <div className="product-card__stars">
    {[1,2,3,4,5].map(star => (
      <span key={star} className={star <= Math.round(rating) ? 'star star--filled' : 'star'}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const inWishlist = isAuthenticated && isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to save to wishlist');
      return;
    }
    await toggleWishlist(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <Link to={`/shop/${product.slug}`} className="product-card__link">
        {/* Image */}
        <div className="product-card__image-wrap">
          {product.thumbnailImage ? (
            <img src={product.thumbnailImage} alt={product.name} className="product-card__image" />
          ) : (
            <div className="product-card__image-placeholder">✦</div>
          )}

          {/* Badges */}
          <div className="product-card__badges">
            {product.isNewArrival && <span className="badge badge--new">New</span>}
            {product.isBestSeller && <span className="badge badge--best">Bestseller</span>}
            {discount && <span className="badge badge--sale">−{discount}%</span>}
          </div>

          {/* Actions overlay */}
          <div className="product-card__actions">
            <button className="product-card__action-btn" onClick={handleWishlist} title="Save to wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-card__info">
          {product.gemstone && (
            <span className="product-card__gemstone">{product.gemstone.name}</span>
          )}
          <h3 className="product-card__name">{product.name}</h3>
          {product.rating > 0 && (
            <div className="product-card__rating">
              <StarRating rating={product.rating} />
              <span>({product.numReviews})</span>
            </div>
          )}
          <div className="product-card__price-row">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="product-card__compare">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <button className="product-card__add-btn" onClick={handleAddToCart} disabled={!product.isInStock}>
        {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;

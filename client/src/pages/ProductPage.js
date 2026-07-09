import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductPage.css';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addToCart } = useCart();
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const inWishlist = isAuthenticated && product && isInWishlist(product._id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please sign in');
    await toggleWishlist(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please sign in to leave a review');
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('Review submitted');
      setReviewComment('');
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="product-page product-page--loading">
        <div className="container">
          <div className="product-page__skeleton-grid">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton-line" style={{ width: `${[80,50,100,60,40][i]}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <Link to="/shop" className="btn btn-outline" style={{ marginTop: '24px' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <div className="container">
          <nav>
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/shop">Shop</Link>
            {product.category && (
              <><span>›</span><Link to={`/shop?category=${product.category}`}>{product.category}</Link></>
            )}
            <span>›</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="product-page__grid">
          {/* Images */}
          <div className="product-images">
            <div className="product-images__main">
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={product.name} />
              ) : (
                <div className="product-images__placeholder">
                  <span>✦</span>
                </div>
              )}
              {product.isBestSeller && <div className="product-badge product-badge--bestseller">Bestseller</div>}
              {product.isNewArrival && <div className="product-badge product-badge--new">New Arrival</div>}
            </div>
            {images.length > 1 && (
              <div className="product-images__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-images__thumb ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="product-details">
            {product.gemstone && (
              <Link to={`/gemstones/${product.gemstone.slug}`} className="product-details__gemstone">
                {product.gemstone.name}
              </Link>
            )}
            {product.collection && (
              <p className="product-details__collection">
                From the <Link to={`/collections/${product.collection.slug}`}>{product.collection.name}</Link> Collection
              </p>
            )}

            <h1 className="product-details__name">{product.name}</h1>

            {product.rating > 0 && (
              <div className="product-details__rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span>({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="product-details__price-row">
              <span className="product-details__price">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="product-details__compare">${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="product-details__short-desc">{product.shortDescription}</p>

            {/* Materials */}
            {product.materials?.length > 0 && (
              <div className="product-details__materials">
                <span className="product-details__label">Materials:</span>
                <span>{product.materials.join(', ')}</span>
              </div>
            )}

            {/* Gemstone Energy */}
            {product.energeticMeaning && (
              <div className="product-details__energy">
                <div className="product-details__energy-header">
                  <span className="product-details__label">✦ Gemstone Energy</span>
                </div>
                <p>{product.energeticMeaning}</p>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="product-details__actions">
              <div className="product-details__qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button
                className="btn btn-primary product-details__add-btn"
                onClick={handleAddToCart}
                disabled={!product.isInStock}
              >
                {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="product-details__secondary-actions">
              <button className={`product-details__wishlist ${inWishlist ? 'active' : ''}`} onClick={handleWishlist}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="product-details__trust">
              {['Free shipping over $150', 'Handmade with care', 'Ethically sourced gemstones'].map(item => (
                <div key={item} className="product-details__trust-item">
                  <span>✓</span><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            {[
              { key: 'description', label: 'Story & Description' },
              { key: 'energy', label: 'Gemstone Energy' },
              { key: 'care', label: 'Care Instructions' },
              { key: 'reviews', label: `Reviews (${product.numReviews})` },
            ].map(tab => (
              <button
                key={tab.key}
                className={`product-tabs__tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="product-tabs__content">
            {activeTab === 'description' && (
              <div className="product-tabs__panel">
                <p>{product.description}</p>
                {product.dimensions && (
                  <div className="product-dimensions">
                    <h4>Dimensions</h4>
                    <ul>
                      {product.dimensions.length && <li>Length: {product.dimensions.length}</li>}
                      {product.dimensions.width && <li>Width: {product.dimensions.width}</li>}
                      {product.dimensions.weight && <li>Weight: {product.dimensions.weight}</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="product-tabs__panel">
                {product.gemstone && (
                  <div className="product-gemstone-detail">
                    <h3>{product.gemstone.name} Energy</h3>
                    {product.energeticMeaning && <p>{product.energeticMeaning}</p>}
                    <Link to={`/gemstones/${product.gemstone.slug}`} className="btn btn-ghost" style={{ marginTop: '20px' }}>
                      Learn more about {product.gemstone.name} →
                    </Link>
                  </div>
                )}
                {!product.gemstone && product.energeticMeaning && <p>{product.energeticMeaning}</p>}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="product-tabs__panel">
                <p>{product.careInstructions || 'Store in a dry place away from direct sunlight. Clean gently with a soft cloth. Avoid contact with perfumes and harsh chemicals. Remove before swimming or bathing.'}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="product-tabs__panel">
                {product.reviews?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your experience.</p>
                ) : (
                  <div className="reviews-list">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="review-item">
                        <div className="review-item__header">
                          <span className="review-item__name">{review.name}</span>
                          <span className="review-item__stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          <span className="review-item__date">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="review-item__comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isAuthenticated && (
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <h4>Leave a Review</h4>
                    <div className="review-form__stars">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={star <= reviewRating ? 'star-btn star-btn--active' : 'star-btn'}
                          onClick={() => setReviewRating(star)}
                        >★</button>
                      ))}
                    </div>
                    <textarea
                      className="form-input"
                      placeholder="Share your experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                    />
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

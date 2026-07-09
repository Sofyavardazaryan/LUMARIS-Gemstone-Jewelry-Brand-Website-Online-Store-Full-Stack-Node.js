import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import './ShopPage.css';

const CATEGORIES = [
  { value: '', label: 'All Jewelry' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'pendants', label: 'Pendants' },
  { value: 'rings', label: 'Rings' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'sets', label: 'Sets' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const bestSeller = searchParams.get('bestSeller') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort,
        ...(category && { category }),
        ...(search && { search }),
        ...(featured && { featured }),
        ...(newArrival && { newArrival }),
        ...(bestSeller && { bestSeller }),
      });
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort, featured, newArrival, bestSeller]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [category, search, sort]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const pageTitle = bestSeller === 'true' ? 'Best Sellers'
    : newArrival === 'true' ? 'New Arrivals'
    : featured === 'true' ? 'Featured'
    : CATEGORIES.find(c => c.value === category)?.label || 'All Jewelry';

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-page__header">
        <div className="container">
          <p className="section-label">Lumaris Collection</p>
          <h1>{pageTitle}</h1>
          {search && <p className="shop-page__search-note">Results for "{search}" — {total} pieces found</p>}
        </div>
      </div>

      <div className="container">
        <div className="shop-page__layout">
          {/* Sidebar Filters */}
          <aside className="shop-filters">
            <div className="shop-filters__section">
              <h4 className="shop-filters__title">Category</h4>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className={`shop-filters__option ${category === cat.value ? 'shop-filters__option--active' : ''}`}
                  onClick={() => updateFilter('category', cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="shop-filters__section">
              <h4 className="shop-filters__title">Collection Type</h4>
              <button
                className={`shop-filters__option ${newArrival === 'true' ? 'shop-filters__option--active' : ''}`}
                onClick={() => updateFilter('newArrival', newArrival === 'true' ? '' : 'true')}
              >
                New Arrivals
              </button>
              <button
                className={`shop-filters__option ${bestSeller === 'true' ? 'shop-filters__option--active' : ''}`}
                onClick={() => updateFilter('bestSeller', bestSeller === 'true' ? '' : 'true')}
              >
                Best Sellers
              </button>
              <button
                className={`shop-filters__option ${featured === 'true' ? 'shop-filters__option--active' : ''}`}
                onClick={() => updateFilter('featured', featured === 'true' ? '' : 'true')}
              >
                Featured
              </button>
            </div>

            <div className="shop-filters__section">
              <h4 className="shop-filters__title">Price Range</h4>
              {[
                { label: 'Under $100', min: '', max: '100' },
                { label: '$100 – $250', min: '100', max: '250' },
                { label: '$250 – $500', min: '250', max: '500' },
                { label: 'Over $500', min: '500', max: '' },
              ].map(range => (
                <button
                  key={range.label}
                  className="shop-filters__option"
                  onClick={() => {
                    updateFilter('minPrice', range.min);
                    updateFilter('maxPrice', range.max);
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div className="shop-products">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <span className="shop-toolbar__count">{total} pieces</span>
              <select
                className="shop-toolbar__sort"
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="products-grid">
                {[...Array(12)].map((_, i) => <div key={i} className="product-skeleton" style={{ aspectRatio: '3/4' }} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state" style={{ padding: '80px 0' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--border-medium)" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>No pieces found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="shop-pagination">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`shop-pagination__btn ${page === i + 1 ? 'shop-pagination__btn--active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import './CollectionPage.css';

const CollectionPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/collections/${slug}`)
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="loading-page"><div className="loading-page__logo">LUMARIS</div><div className="loading-page__spinner"/></div>;
  if (!data) return <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Collection not found</h2><Link to="/collections" className="btn btn-outline" style={{ marginTop: 24 }}>All Collections</Link></div>;

  const { collection, products } = data;

  return (
    <div className="collection-page">
      {/* Hero */}
      <section className="collection-hero" style={{ '--bg': collection.coverImage ? `url(${collection.coverImage}) center/cover` : '#1a2639' }}>
        <div className="collection-hero__bg" />
        <div className="container">
          <div className="collection-hero__content">
            <Link to="/collections" className="collection-hero__back">← All Collections</Link>
            <p className="section-label">{collection.inspirationType} · {collection.inspiration}</p>
            <h1 className="collection-hero__title">{collection.name}</h1>
            {collection.subtitle && <p className="collection-hero__subtitle">{collection.subtitle}</p>}
            {collection.era && <p className="collection-hero__era">{collection.era}</p>}
          </div>
        </div>
      </section>

      {/* Quote */}
      {collection.quote && (
        <section className="collection-quote">
          <div className="container">
            <blockquote className="collection-quote__text">
              <p>"{collection.quote}"</p>
              {collection.quoteAuthor && <cite>— {collection.quoteAuthor}</cite>}
            </blockquote>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="section-padding">
        <div className="container">
          <div className="collection-story">
            <div className="collection-story__text">
              <p className="section-label">The Story</p>
              <h2>{collection.name}</h2>
              <div className="divider-left divider" style={{ marginLeft: 0 }} />
              <p className="collection-story__intro">{collection.storyIntroduction}</p>

              {collection.historicalBackground && (
                <>
                  <h4>Historical Background</h4>
                  <p>{collection.historicalBackground}</p>
                </>
              )}

              {collection.emotionalMeaning && (
                <>
                  <h4>Emotional Meaning</h4>
                  <p>{collection.emotionalMeaning}</p>
                </>
              )}

              {collection.gemstoneConnection && (
                <div className="collection-story__gem-connection">
                  <p className="section-label">Gemstone & Story</p>
                  <p>{collection.gemstoneConnection}</p>
                </div>
              )}
            </div>

            {collection.galleryImages?.length > 0 && (
              <div className="collection-story__gallery">
                {collection.galleryImages.slice(0, 4).map((img, i) => (
                  <div key={i} className="collection-gallery-image">
                    <img src={img} alt={`${collection.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding" style={{ background: 'var(--ivory)' }}>
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">The Collection</p>
            <h2>Pieces of {collection.name}</h2>
            <div className="divider" />
          </div>

          {products?.length === 0 ? (
            <div className="empty-state">
              <p>Pieces from this collection are coming soon.</p>
              <Link to="/shop" className="btn btn-outline">Browse All Jewelry</Link>
            </div>
          ) : (
            <div className="products-grid-4">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CollectionPage;

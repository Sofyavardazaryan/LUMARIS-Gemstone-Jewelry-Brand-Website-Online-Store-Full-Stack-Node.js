import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import './GemstonePage.css';

const GEMSTONE_COLORS = {
  emerald: '#27AE60', aquamarine: '#5DADE2', opal: '#E8D5C4',
  moonstone: '#85C1E9', amethyst: '#9B59B6', citrine: '#F4D03F',
  pyrite: '#C9A84C', 'rose-quartz': '#F1948A',
};

const GemstonePage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/gemstones/${slug}`)
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="loading-page"><div className="loading-page__logo">LUMARIS</div><div className="loading-page__spinner"/></div>;
  if (!data) return <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Gemstone not found</h2><Link to="/gemstones" className="btn btn-outline" style={{ marginTop: 24 }}>Back to Gemstones</Link></div>;

  const { gemstone, products } = data;
  const color = GEMSTONE_COLORS[slug] || '#b8966a';

  return (
    <div className="gemstone-page">
      {/* Hero */}
      <section className="gemstone-hero" style={{ '--gem-color': color }}>
        <div className="gemstone-hero__bg" />
        <div className="container">
          <div className="gemstone-hero__content">
            <div className="gemstone-hero__orb" style={{ background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}33)`, boxShadow: `0 0 80px ${color}44` }} />
            <div className="gemstone-hero__text">
              <Link to="/gemstones" className="gemstone-hero__back">← Gemstone Library</Link>
              <h1 className="gemstone-hero__name">{gemstone.name}</h1>
              {gemstone.color && <p className="gemstone-hero__color">{gemstone.color}</p>}
              {gemstone.mohs && <p className="gemstone-hero__mohs">Mohs hardness: {gemstone.mohs}</p>}
              <p className="gemstone-hero__desc">{gemstone.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Energy & Properties */}
      <section className="section-padding">
        <div className="container">
          <div className="gemstone-info__grid">

            <div className="gemstone-info__card">
              <div className="gemstone-info__icon">✦</div>
              <h3>Energetic Properties</h3>
              <p>{gemstone.energeticProperties}</p>
            </div>

            {gemstone.emotionalProperties && (
              <div className="gemstone-info__card">
                <div className="gemstone-info__icon">◈</div>
                <h3>Emotional Qualities</h3>
                <p>{gemstone.emotionalProperties}</p>
              </div>
            )}

            {gemstone.symbolism && (
              <div className="gemstone-info__card">
                <div className="gemstone-info__icon">❋</div>
                <h3>Symbolism</h3>
                <p>{gemstone.symbolism}</p>
              </div>
            )}

            {gemstone.spiritualAssociations && (
              <div className="gemstone-info__card">
                <div className="gemstone-info__icon">⟡</div>
                <h3>Spiritual Associations</h3>
                <p>{gemstone.spiritualAssociations}</p>
              </div>
            )}
          </div>

          {/* Extra Details */}
          <div className="gemstone-details">
            <div className="gemstone-details__row">
              {gemstone.chakra && (
                <div className="gemstone-detail-item">
                  <span className="gemstone-detail-item__label">Chakra</span>
                  <span className="gemstone-detail-item__value">{gemstone.chakra}</span>
                </div>
              )}
              {gemstone.planet && (
                <div className="gemstone-detail-item">
                  <span className="gemstone-detail-item__label">Planet</span>
                  <span className="gemstone-detail-item__value">{gemstone.planet}</span>
                </div>
              )}
              {gemstone.element && (
                <div className="gemstone-detail-item">
                  <span className="gemstone-detail-item__label">Element</span>
                  <span className="gemstone-detail-item__value">{gemstone.element}</span>
                </div>
              )}
              {gemstone.zodiacSign?.length > 0 && (
                <div className="gemstone-detail-item">
                  <span className="gemstone-detail-item__label">Zodiac</span>
                  <span className="gemstone-detail-item__value">{gemstone.zodiacSign.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Geological Background */}
          {gemstone.geologicalBackground && (
            <div className="gemstone-geology">
              <h3>Geological Origins</h3>
              <p>{gemstone.geologicalBackground}</p>
            </div>
          )}

          {/* Care */}
          {gemstone.careInstructions && (
            <div className="gemstone-care">
              <h3>Care & Cleansing</h3>
              <p>{gemstone.careInstructions}</p>
            </div>
          )}
        </div>
      </section>

      {/* Jewelry with this stone */}
      {products?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--ivory)' }}>
          <div className="container">
            <div className="section-header text-center">
              <p className="section-label">Lumaris Collection</p>
              <h2>Jewelry Featuring {gemstone.name}</h2>
              <div className="divider" />
            </div>
            <div className="products-grid">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default GemstonePage;

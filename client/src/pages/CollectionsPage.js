import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './CollectionsPage.css';

const TYPE_FILTERS = [
  { value: '', label: 'All Collections' },
  { value: 'person', label: 'Historical Figures' },
  { value: 'city', label: 'Cities' },
  { value: 'literature', label: 'Literature' },
  { value: 'cinema', label: 'Cinema' },
  { value: 'era', label: 'Cultural Eras' },
  { value: 'event', label: 'Historical Events' },
];

const COLLECTION_BG_COLORS = [
  '#1A2639', '#2C3E50', '#4A235A', '#1C2833',
  '#1A5276', '#196F3D', '#4A1942', '#2E4057'
];

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');

  useEffect(() => {
    const params = activeType ? `?type=${activeType}` : '';
    api.get(`/collections${params}`)
      .then(({ data }) => setCollections(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="collections-page">
      {/* Hero */}
      <section className="collections-page__hero">
        <div className="container">
          <p className="section-label">Artistic Exhibitions</p>
          <h1>Our Collections</h1>
          <div className="divider" />
          <p className="collections-page__hero-desc">
            Each collection is an invitation — to step into a world, meet a soul,
            walk through a city, or experience a moment that changed history.
            Jewelry as storytelling. Gemstones as language.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="collections-page__filters">
        <div className="container">
          <div className="collections-filters">
            {TYPE_FILTERS.map(filter => (
              <button
                key={filter.value}
                className={`collections-filter-btn ${activeType === filter.value ? 'active' : ''}`}
                onClick={() => { setActiveType(filter.value); setLoading(true); }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="collections-page__grid">
              {[...Array(6)].map((_, i) => <div key={i} className="collection-page-skeleton" />)}
            </div>
          ) : collections.length === 0 ? (
            <div className="empty-state">
              <p>No collections found in this category.</p>
            </div>
          ) : (
            <div className="collections-page__grid">
              {collections.map((col, i) => (
                <Link key={col._id} to={`/collections/${col.slug}`} className="collection-page-card">
                  <div className="collection-page-card__image"
                    style={{
                      background: col.coverImage
                        ? `url(${col.coverImage}) center/cover`
                        : COLLECTION_BG_COLORS[i % COLLECTION_BG_COLORS.length]
                    }}
                  >
                    <div className="collection-page-card__overlay" />
                    <div className="collection-page-card__type">{col.inspirationType}</div>
                  </div>
                  <div className="collection-page-card__body">
                    <p className="collection-page-card__subtitle">{col.inspiration}</p>
                    <h3 className="collection-page-card__name">{col.name}</h3>
                    {col.era && <p className="collection-page-card__era">{col.era}</p>}
                    <p className="collection-page-card__story">{col.storyIntroduction}</p>
                    <span className="collection-page-card__cta">Explore Collection →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;

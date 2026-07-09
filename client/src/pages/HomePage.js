import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import './HomePage.css';

const GEMSTONE_PREVIEWS = [
  { name: 'Amethyst', color: '#9B59B6', energy: 'Clarity · Intuition · Peace', slug: 'amethyst' },
  { name: 'Emerald', color: '#27AE60', energy: 'Growth · Love · Renewal', slug: 'emerald' },
  { name: 'Moonstone', color: '#85C1E9', energy: 'Intuition · Balance · New Beginnings', slug: 'moonstone' },
  { name: 'Aquamarine', color: '#5DADE2', energy: 'Courage · Clarity · Serenity', slug: 'aquamarine' },
  { name: 'Citrine', color: '#F4D03F', energy: 'Abundance · Joy · Confidence', slug: 'citrine' },
  { name: 'Rose Quartz', color: '#F1948A', energy: 'Love · Compassion · Harmony', slug: 'rose-quartz' },
];

const COLLECTION_PREVIEWS = [
  {
    name: 'Vita Nuova',
    subtitle: 'Inspired by Dante Alighieri',
    description: 'A journey through love and transcendence, captured in emerald and gold.',
    slug: 'vita-nuova',
    color: '#2C3E50'
  },
  {
    name: 'Wuthering Heights',
    subtitle: 'Inspired by Emily Brontë',
    description: 'Wild moors, tempestuous passions, and timeless longing in deep amethyst.',
    slug: 'wuthering-heights',
    color: '#4A235A'
  },
  {
    name: 'Queen Victoria',
    subtitle: 'The Victorian Era',
    description: 'Regal elegance and mourning jewelry traditions reimagined in onyx and pearl.',
    slug: 'queen-victoria',
    color: '#1C2833'
  },
  {
    name: 'La Serenissima',
    subtitle: 'Inspired by Venice',
    description: 'Venetian light on water, aquamarine mists, and the golden reflections of the lagoon.',
    slug: 'la-serenissima',
    color: '#1A5276'
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?bestSeller=true&limit=4')
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setBestSellers(bestRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <p className="section-label">Est. 2024 · Handmade</p>
          <h1 className="hero__title">
            Natural Gemstone Jewelry<br />
            <em>Inspired by Energy,<br />History & Meaning</em>
          </h1>
          <p className="hero__subtitle">
            Each piece carries the vibration of the earth — connecting you to centuries of story,
            symbolism, and the timeless language of gemstones.
          </p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
            <Link to="/gemstones" className="btn btn-outline hero__btn-outline">Discover Gemstones</Link>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Philosophy Strip ────────────────────────────── */}
      <section className="philosophy-strip">
        <div className="container">
          <div className="philosophy-strip__grid">
            {[
              { icon: '✦', label: 'Natural Gemstones', desc: 'Ethically sourced, energetically pure' },
              { icon: '◈', label: 'Handcrafted', desc: 'Each piece made by skilled artisans' },
              { icon: '❋', label: 'Storytelling', desc: 'History, art, and literature in every design' },
              { icon: '⟡', label: 'Energy & Meaning', desc: 'Gemstones chosen for their unique vibration' },
            ].map(item => (
              <div key={item.label} className="philosophy-item">
                <div className="philosophy-item__icon">{item.icon}</div>
                <h4 className="philosophy-item__label">{item.label}</h4>
                <p className="philosophy-item__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Curated for You</p>
            <h2>Featured Pieces</h2>
            <div className="divider" />
          </div>
          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4].map(i => <div key={i} className="product-skeleton" />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Featured collection coming soon.</p>
              <Link to="/shop" className="btn btn-outline">Browse All Jewelry</Link>
            </div>
          )}
          <div className="section-footer">
            <Link to="/shop" className="btn btn-ghost">View All Jewelry →</Link>
          </div>
        </div>
      </section>

      {/* ── Gemstone Energy Section ─────────────────────── */}
      <section className="gemstone-energy section-padding">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">The Energy Within</p>
            <h2>Discover Your Gemstone</h2>
            <p className="section-description">
              Each stone carries a unique frequency — a vibration that resonates with emotions,
              intentions, and the invisible threads connecting us to the universe.
            </p>
            <div className="divider" />
          </div>
          <div className="gemstone-energy__grid">
            {GEMSTONE_PREVIEWS.map(gem => (
              <Link key={gem.name} to={`/gemstones/${gem.slug}`} className="gem-card">
                <div className="gem-card__orb" style={{ background: `radial-gradient(circle at 40% 40%, ${gem.color}aa, ${gem.color}44)`, boxShadow: `0 8px 32px ${gem.color}33` }} />
                <h4 className="gem-card__name">{gem.name}</h4>
                <p className="gem-card__energy">{gem.energy}</p>
              </Link>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/gemstones" className="btn btn-ghost">Explore Gemstone Library →</Link>
          </div>
        </div>
      </section>

      {/* ── Collections ─────────────────────────────────── */}
      <section className="collections-preview section-padding">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Artistic Exhibitions</p>
            <h2>Our Collections</h2>
            <p className="section-description">
              Each collection is a journey — through a life, a city, a story, a feeling.
            </p>
            <div className="divider" />
          </div>
          <div className="collections-grid">
            {COLLECTION_PREVIEWS.map(col => (
              <Link key={col.slug} to={`/collections/${col.slug}`} className="collection-card" style={{ '--col-color': col.color }}>
                <div className="collection-card__bg" />
                <div className="collection-card__content">
                  <p className="collection-card__subtitle">{col.subtitle}</p>
                  <h3 className="collection-card__name">{col.name}</h3>
                  <p className="collection-card__desc">{col.description}</p>
                  <span className="collection-card__cta">Explore Collection →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/collections" className="btn btn-ghost">View All Collections →</Link>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--ivory)' }}>
          <div className="container">
            <div className="section-header text-center">
              <p className="section-label">Most Loved</p>
              <h2>Best Sellers</h2>
              <div className="divider" />
            </div>
            <div className="products-grid">
              {bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="section-footer">
              <Link to="/shop?bestSeller=true" className="btn btn-ghost">View All Best Sellers →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Brand Story Preview ─────────────────────────── */}
      <section className="brand-story section-padding">
        <div className="container">
          <div className="brand-story__grid">
            <div className="brand-story__visual">
              <div className="brand-story__orb brand-story__orb--1" />
              <div className="brand-story__orb brand-story__orb--2" />
              <div className="brand-story__quote">
                <p>"A gemstone is not merely a stone —<br />it is a memory of the earth,<br />a fragment of time made tangible."</p>
              </div>
            </div>
            <div className="brand-story__text">
              <p className="section-label">Our Philosophy</p>
              <h2>Where Energy Meets Artistry</h2>
              <div className="divider-left divider" style={{ marginLeft: 0 }} />
              <p>
                Lumaris was born from a deep fascination with the invisible — the energy that flows through
                natural gemstones, the emotion embedded in historical stories, and the connection between
                beauty and meaning.
              </p>
              <p style={{ marginTop: '16px' }}>
                We believe jewelry is more than ornament. It is language. Each piece we create speaks of
                a specific energy, carries a story, and connects its wearer to something larger than themselves.
              </p>
              <Link to="/about" className="btn btn-outline" style={{ marginTop: '28px' }}>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journal Preview ─────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ color: 'var(--moonlight)' }}>
            <p className="section-label">The Lumaris Journal</p>
            <h2 style={{ color: 'var(--champagne-light)' }}>Stories & Wisdom</h2>
            <div className="divider" />
            <p style={{ color: 'var(--soft-gray)', maxWidth: 480, margin: '0 auto' }}>
              Explore the energy of gemstones, the history behind our collections, and the symbolism
              woven into every piece.
            </p>
          </div>
          <div className="section-footer">
            <Link to="/blog" className="btn btn-outline" style={{ borderColor: 'var(--champagne-light)', color: 'var(--champagne-light)' }}>
              Read the Journal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta__content">
            <p className="section-label">Find Your Stone</p>
            <h2>Ready to Begin Your Journey?</h2>
            <p>Explore our curated collections and discover the gemstone that speaks to your energy.</p>
            <div className="final-cta__buttons">
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <Link to="/gemstones" className="btn btn-outline">Gemstone Guide</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

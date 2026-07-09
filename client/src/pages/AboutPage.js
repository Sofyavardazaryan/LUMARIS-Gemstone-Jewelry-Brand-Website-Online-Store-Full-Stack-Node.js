import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => (
  <div className="about-page">
    {/* Hero */}
    <section className="about-hero">
      <div className="about-hero__bg" />
      <div className="container about-hero__content">
        <p className="section-label">Our Philosophy</p>
        <h1>About Lumaris</h1>
        <div className="divider" />
        <p className="about-hero__tagline">
          "Where the energy of the earth meets the language of art"
        </p>
      </div>
    </section>

    {/* Philosophy */}
    <section className="section-padding">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <p className="section-label">The Lumaris Vision</p>
            <h2>Jewelry as Language</h2>
            <div className="divider-left divider" style={{ marginLeft: 0 }} />
            <p>
              Lumaris was born from a deep fascination with the invisible — the energy that flows through
              natural gemstones, the emotion embedded in historical stories, and the profound connection
              between beauty and meaning.
            </p>
            <p>
              We believe that jewelry is far more than ornament. It is language. Each piece speaks of
              a specific energy, carries a story, and connects its wearer to something larger than themselves.
            </p>
            <p>
              Every stone we work with has been selected not merely for its beauty, but for the unique
              vibration it carries — a frequency that has been recognized and honored by civilizations
              across millennia.
            </p>
          </div>
          <div className="about-visual">
            <div className="about-visual__orb about-visual__orb--1" />
            <div className="about-visual__orb about-visual__orb--2" />
            <div className="about-visual__quote">
              <p>"A gemstone is not merely a stone —<br/>it is a memory of the earth."</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Gemstone Energy */}
    <section className="about-energy section-padding">
      <div className="container">
        <div className="section-header text-center">
          <p className="section-label">The Energy Within</p>
          <h2>Working with Natural Gemstones</h2>
          <div className="divider" />
        </div>
        <div className="about-energy__grid">
          {[
            { title: 'Vibrational Energy', desc: 'Each gemstone carries a unique electromagnetic frequency — shaped by millions of years of geological formation — that interacts with the human energy field.' },
            { title: 'Emotional Resonance', desc: 'Different stones are known to amplify specific emotions and intentions. We choose each stone carefully to align with the story and energy of each collection.' },
            { title: 'Ancient Wisdom', desc: 'From Egyptian pharaohs adorned with lapis lazuli to Vedic astrologers prescribing specific stones for planetary balance, gemstone energy spans all of human history.' },
            { title: 'Intentional Creation', desc: 'Every Lumaris piece is made with awareness of the energetic properties it carries. We work with stones that have been cleansed and charged with positive intention.' },
          ].map(item => (
            <div key={item.title} className="about-energy-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/gemstones" className="btn btn-outline">Explore Gemstone Library</Link>
        </div>
      </div>
    </section>

    {/* Inspiration */}
    <section className="about-inspiration section-padding">
      <div className="container">
        <div className="section-header text-center">
          <p className="section-label">The Inspiration</p>
          <h2>History, Art & Literature</h2>
          <div className="divider" />
          <p className="section-description">
            Our collections draw inspiration from the full canvas of human culture —
            the people, places, events, and stories that have shaped our world.
          </p>
        </div>
        <div className="about-inspiration__grid">
          {[
            { icon: '◈', label: 'Historical Figures', desc: 'Queens, poets, revolutionaries — the lives of extraordinary people become the soul of our collections.' },
            { icon: '❋', label: 'Sacred Cities', desc: 'Venice, Florence, Istanbul, Paris — cities whose beauty and history live in the stones they inspired.' },
            { icon: '✦', label: 'Literature', desc: 'From Dante\'s eternal love to Brontë\'s wild passion — great literature crystallized in gemstone and gold.' },
            { icon: '⟡', label: 'Cinema & Art', desc: 'Film, painting, and the visual arts provide endless inspiration for the beauty we create.' },
          ].map(item => (
            <div key={item.label} className="about-inspiration-item">
              <div className="about-inspiration-item__icon">{item.icon}</div>
              <h4>{item.label}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/collections" className="btn btn-outline">Explore Collections</Link>
        </div>
      </div>
    </section>

    {/* Craftsmanship */}
    <section className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="about-craft">
          <div className="about-craft__text">
            <p className="section-label" style={{ color: 'var(--champagne)' }}>The Craft</p>
            <h2 style={{ color: 'var(--champagne-light)' }}>Handmade with Care</h2>
            <div className="divider-left divider" style={{ marginLeft: 0 }} />
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Every Lumaris piece is made by hand, by skilled artisans who understand not just the technical
              demands of jewelry-making, but the deeper intention behind each design.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 16 }}>
              We use ethically sourced natural gemstones, high-quality metals, and time-honored techniques
              combined with contemporary artistry to create pieces that are made to last a lifetime — and beyond.
            </p>
          </div>
          <div className="about-craft__values">
            {['Ethically sourced gemstones', 'Sterling silver & gold vermeil', 'Skilled artisan craftsmanship', 'Quality guaranteed', 'Sustainable practices'].map(val => (
              <div key={val} className="about-craft__value">
                <span>✓</span><span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding" style={{ background: 'var(--ivory)', textAlign: 'center' }}>
      <div className="container">
        <h2>Begin Your Journey</h2>
        <p style={{ marginTop: 12, marginBottom: 32, maxWidth: 480, margin: '12px auto 32px', fontSize: 15 }}>
          Find the stone that speaks to your energy. Discover the collection that resonates with your story.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
          <Link to="/contact" className="btn btn-outline">Contact Us</Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;

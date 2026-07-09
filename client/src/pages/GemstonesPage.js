import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './GemstonesPage.css';

const GEMSTONE_COLORS = {
  emerald: '#27AE60', aquamarine: '#5DADE2', opal: '#E8D5C4',
  moonstone: '#85C1E9', amethyst: '#9B59B6', citrine: '#F4D03F',
  pyrite: '#C9A84C', 'rose-quartz': '#F1948A', "tiger's-eye": '#CA8A04',
  malachite: '#1E8449', 'lapis-lazuli': '#1A5276', garnet: '#922B21',
  onyx: '#1C1C1C', jade: '#196F3D', turquoise: '#17A589',
  labradorite: '#5B2C6F', 'clear-quartz': '#E8E8E8', 'smoky-quartz': '#6E6E6E'
};

const GemstonesPage = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/gemstones')
      .then(({ data }) => setGemstones(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = gemstones.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.energeticProperties?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gemstones-page">
      {/* Hero */}
      <section className="gemstones-hero">
        <div className="container">
          <p className="section-label">The Energy Within</p>
          <h1>Gemstone Library</h1>
          <div className="divider" />
          <p className="gemstones-hero__desc">
            Each gemstone carries a unique vibration — a language of energy, color, and ancient wisdom.
            Discover the stones that resonate with your intentions.
          </p>
          <div className="gemstones-hero__search">
            <input
              type="text"
              placeholder="Search gemstones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="gemstones-hero__search-input"
            />
          </div>
        </div>
      </section>

      {/* Gemstone Grid */}
      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="gemstones-grid">
              {[...Array(12)].map((_, i) => <div key={i} className="gemstone-card-skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No gemstones found for "{search}"</p>
            </div>
          ) : (
            <div className="gemstones-grid">
              {filtered.map(gem => {
                const color = GEMSTONE_COLORS[gem.slug] || '#b8966a';
                return (
                  <Link key={gem._id} to={`/gemstones/${gem.slug}`} className="gemstone-card">
                    <div className="gemstone-card__visual" style={{
                      background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
                      boxShadow: `inset 0 0 32px ${color}33`
                    }}>
                      <div className="gemstone-card__inner-glow" style={{ background: `radial-gradient(circle at 35% 35%, white 0%, transparent 50%)`, opacity: 0.3 }} />
                    </div>
                    <div className="gemstone-card__info">
                      <h3 className="gemstone-card__name">{gem.name}</h3>
                      {gem.chakra && <p className="gemstone-card__chakra">{gem.chakra} Chakra</p>}
                      <p className="gemstone-card__energy">{gem.energeticProperties}</p>
                      {gem.zodiacSign?.length > 0 && (
                        <p className="gemstone-card__zodiac">{gem.zodiacSign.join(' · ')}</p>
                      )}
                    </div>
                    <div className="gemstone-card__cta">Discover →</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Energy Philosophy */}
      <section className="gemstone-philosophy section-padding">
        <div className="container">
          <div className="gemstone-philosophy__content text-center">
            <p className="section-label">Our Belief</p>
            <h2>The Language of Stones</h2>
            <div className="divider" />
            <p>
              For millennia, civilizations across the world have worked with gemstones — not merely as
              beautiful objects, but as conduits of energy, intention, and healing. The ancient Egyptians
              adorned their pharaohs with lapis lazuli. The Romans wore amethyst for clarity. The Vedic
              tradition mapped planetary energies onto specific stones.
            </p>
            <p style={{ marginTop: 16 }}>
              At Lumaris, we honor this ancient wisdom by selecting each gemstone intentionally,
              creating pieces that carry both beauty and meaning.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GemstonesPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './BlogPage.css';

const CATEGORIES = [
  { value: '', label: 'All Articles' },
  { value: 'gemstone-energy', label: 'Gemstone Energy' },
  { value: 'collection-story', label: 'Collection Stories' },
  { value: 'symbolism', label: 'Symbolism' },
  { value: 'styling', label: 'Styling Guides' },
  { value: 'history', label: 'History' },
  { value: 'craftsmanship', label: 'Craftsmanship' },
];

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 9, ...(category && { category }) });
    api.get(`/blog?${params}`)
      .then(({ data }) => setPosts(data.posts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <p className="section-label">Knowledge & Inspiration</p>
          <h1>The Lumaris Journal</h1>
          <div className="divider" />
          <p className="blog-hero__desc">Explore the energy of gemstones, the stories behind our collections, and the wisdom woven into every piece.</p>
        </div>
      </section>

      <div className="blog-page__filters">
        <div className="container">
          <div className="blog-filters">
            {CATEGORIES.map(cat => (
              <button key={cat.value} className={`blog-filter-btn ${category === cat.value ? 'active' : ''}`} onClick={() => setCategory(cat.value)}>{cat.label}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="blog-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="blog-card-skeleton" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state"><p>No articles found.</p></div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="blog-card">
                  {post.coverImage && (
                    <div className="blog-card__image">
                      <img src={post.coverImage} alt={post.title} />
                    </div>
                  )}
                  {!post.coverImage && (
                    <div className="blog-card__image blog-card__image--placeholder">
                      <span>✦</span>
                    </div>
                  )}
                  <div className="blog-card__body">
                    <p className="blog-card__category">{post.category?.replace('-', ' ')}</p>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <span>{post.authorName || 'Lumaris Team'}</span>
                      {post.readTime && <span>{post.readTime} min read</span>}
                    </div>
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

export default BlogPage;

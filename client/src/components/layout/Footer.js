import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/contact/newsletter', { email });
      toast.success('Welcome to the Lumaris Journal');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">LUMARIS</Link>
            <p className="footer__tagline">Natural Gemstone Jewelry<br />Inspired by Energy, History & Meaning</p>
            <div className="footer__socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a10 10 0 0 0-3.52 19.33c-.05-.56-.08-1.42.02-2.03.09-.55.6-3.54.6-3.54s-.15-.3-.15-.75c0-.7.4-1.22.9-1.22.43 0 .63.32.63.7 0 .43-.27 1.07-.42 1.67-.12.5.25.9.74.9.89 0 1.49-1.01 1.49-2.21 0-.91-.61-1.6-1.73-1.6-1.28 0-2.08.97-2.08 2.07 0 .37.1.64.27.85-.08.34-.25 1.07-.29 1.22-.04.18-.14.25-.32.15-.94-.43-1.4-1.58-1.4-2.87 0-2.13 1.8-4.7 5.4-4.7 2.9 0 4.7 2.1 4.7 4.4 0 3.02-1.67 5.27-4.13 5.27-.83 0-1.6-.45-1.87-.96l-.52 2.08c-.18.72-.65 1.62-.98 2.17A10 10 0 1 0 12 2z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <ul>
              <li><Link to="/shop?category=bracelets">Bracelets</Link></li>
              <li><Link to="/shop?category=necklaces">Necklaces</Link></li>
              <li><Link to="/shop?category=rings">Rings</Link></li>
              <li><Link to="/shop?category=pendants">Pendants</Link></li>
              <li><Link to="/shop?newArrival=true">New Arrivals</Link></li>
              <li><Link to="/shop?bestSeller=true">Best Sellers</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Discover</h4>
            <ul>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/gemstones">Gemstones Library</Link></li>
              <li><Link to="/blog">Journal</Link></li>
              <li><Link to="/about">About Lumaris</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4 className="footer__heading">The Lumaris Journal</h4>
            <p>Gemstone wisdom, collection stories, and exclusive offers delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="footer__newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <button type="submit" disabled={subscribing}>
                {subscribing ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Lumaris. All rights reserved.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/shipping">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

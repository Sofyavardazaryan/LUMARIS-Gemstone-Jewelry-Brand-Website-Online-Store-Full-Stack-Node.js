import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Top announcement bar */}
      <div className="announcement-bar">
        <span>Free shipping on orders over $150 · Handmade with natural gemstones</span>
      </div>

      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHomePage && !scrolled ? 'navbar--transparent' : ''}`}>
        <div className="navbar__inner container">

          {/* Left nav links */}
          <ul className="navbar__links navbar__links--left">
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/collections">Collections</NavLink></li>
            <li><NavLink to="/gemstones">Gemstones</NavLink></li>
          </ul>

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">LUMARIS</span>
            <span className="navbar__logo-sub">Natural Gemstone Jewelry</span>
          </Link>

          {/* Right nav */}
          <ul className="navbar__links navbar__links--right">
            <li><NavLink to="/blog">Journal</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li>
              <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </li>

            {user ? (
              <li className="navbar__user-menu">
                <button className="navbar__icon-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span>{user.firstName} {user.lastName}</span>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/account">My Account</Link>
                  <Link to="/account/orders">Orders</Link>
                  <Link to="/account/wishlist">Wishlist</Link>
                  {isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </li>
            ) : (
              <li><Link to="/login" className="navbar__icon-btn" aria-label="Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link></li>
            )}

            <li>
              <button className="navbar__icon-btn navbar__cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
              </button>
            </li>

            {/* Mobile hamburger */}
            <li className="navbar__hamburger">
              <button className={`hamburger ${menuOpen ? 'hamburger--active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                <span /><span /><span />
              </button>
            </li>
          </ul>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="navbar__search">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewelry, gemstones, collections..."
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-btn">Search</button>
              <button type="button" className="navbar__search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__nav">
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/gemstones">Gemstones</Link>
          <Link to="/blog">Journal</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <div className="mobile-menu__divider" />
          {user ? (
            <>
              <Link to="/account">My Account</Link>
              <Link to="/account/orders">Orders</Link>
              <Link to="/account/wishlist">Wishlist</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;

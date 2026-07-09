import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <div className="not-found__symbol">✦</div>
      <h1 className="not-found__code">404</h1>
      <h2 className="not-found__title">Page Not Found</h2>
      <div className="divider" />
      <p className="not-found__desc">
        This page seems to have wandered off, like a gem waiting to be discovered.
        Let us guide you back.
      </p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn-primary">Return Home</Link>
        <Link to="/shop" className="btn btn-outline">Explore the Collection</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;

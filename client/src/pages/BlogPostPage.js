import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import './BlogPostPage.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(({ data }) => setPost(data))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="loading-page"><div className="loading-page__logo">LUMARIS</div><div className="loading-page__spinner"/></div>;
  if (!post) return <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Article not found</h2><Link to="/blog" className="btn btn-outline" style={{ marginTop: 24 }}>All Articles</Link></div>;

  return (
    <div className="blog-post-page">
      <article className="blog-post">
        <div className="blog-post__hero">
          <div className="container">
            <Link to="/blog" className="blog-post__back">← Journal</Link>
            <p className="section-label">{post.category?.replace('-', ' ')}</p>
            <h1 className="blog-post__title">{post.title}</h1>
            <div className="blog-post__meta">
              <span>{post.authorName || 'Lumaris Team'}</span>
              {post.readTime && <span>{post.readTime} min read</span>}
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {post.coverImage && (
          <div className="blog-post__cover">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        <div className="container">
          <div className="blog-post__content">
            {post.excerpt && <p className="blog-post__lead">{post.excerpt}</p>}
            <div className="blog-post__body" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>

          {(post.relatedGemstone || post.relatedCollection) && (
            <div className="blog-post__related">
              {post.relatedGemstone && (
                <Link to={`/gemstones/${post.relatedGemstone.slug}`} className="blog-post__related-link">
                  <span className="section-label">Explore the Stone</span>
                  <h4>{post.relatedGemstone.name}</h4>
                  <span>Discover energy & properties →</span>
                </Link>
              )}
              {post.relatedCollection && (
                <Link to={`/collections/${post.relatedCollection.slug}`} className="blog-post__related-link">
                  <span className="section-label">The Collection</span>
                  <h4>{post.relatedCollection.name}</h4>
                  <span>Explore collection →</span>
                </Link>
              )}
            </div>
          )}

          <div className="blog-post__footer">
            <Link to="/blog" className="btn btn-outline">← Back to Journal</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;

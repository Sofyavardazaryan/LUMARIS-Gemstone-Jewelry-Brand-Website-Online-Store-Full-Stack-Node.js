import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual" />
      <div className="auth-page__form-side">
        <div className="auth-form-container">
          <Link to="/" className="auth-form__logo">LUMARIS</Link>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <h2 className="auth-form__title">Check Your Email</h2>
              <p className="auth-form__subtitle">A reset link has been sent to {email}</p>
              <Link to="/login" className="btn btn-outline" style={{ marginTop: 24 }}>Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="auth-form__title">Reset Password</h2>
              <p className="auth-form__subtitle">Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="auth-form__switch"><Link to="/login">← Back to Login</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

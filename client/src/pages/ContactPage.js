import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch { toast.error('Could not send message. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <p className="section-label">Get in Touch</p>
          <h1>Contact Lumaris</h1>
          <div className="divider" />
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h2>We'd Love to Hear From You</h2>
              <p>Whether you have questions about our collections, need help with an order, or simply want to know more about the energy of gemstones — we're here.</p>

              <div className="contact-info__items">
                <div className="contact-info__item">
                  <div className="contact-info__icon">✉</div>
                  <div>
                    <p className="contact-info__label">Email</p>
                    <p>hello@lumaris.com</p>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__icon">⟡</div>
                  <div>
                    <p className="contact-info__label">Response Time</p>
                    <p>Within 24–48 hours</p>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__icon">◈</div>
                  <div>
                    <p className="contact-info__label">Follow Us</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--champagne)', fontSize: 13, letterSpacing: 1 }}>Instagram</a>
                      <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--champagne)', fontSize: 13, letterSpacing: 1 }}>Pinterest</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {sent ? (
                <div className="contact-success">
                  <div className="contact-success__icon">✦</div>
                  <h3>Message Sent</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24–48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form__row">
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" className="form-input" placeholder="How can we help?" value={form.subject} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-input" rows={7} placeholder="Tell us about your question or request..." value={form.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

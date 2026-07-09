import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Review & Pay'];

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingCost, taxAmount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [guestEmail, setGuestEmail] = useState('');

  // Stripe card fields (simplified — in production use Stripe Elements)
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleShippingChange = (e) => setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCardChange = (e) => setCardInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      // Create order
      const { data: order } = await api.post('/orders', {
        items: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
        shippingAddress: shipping,
        paymentMethod: 'stripe',
        guestEmail: !user ? guestEmail : undefined
      });

      // Create payment intent
      await api.post('/payment/create-payment-intent', {
        amount: totalAmount,
        orderId: order._id
      });

      // In production: use Stripe.js to confirm payment with clientSecret
      // For this demo, we simulate payment confirmation
      await api.put(`/orders/${order._id}/pay`, {
        id: `pi_demo_${Date.now()}`,
        status: 'succeeded',
        updateTime: new Date().toISOString()
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step === 0) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__header">
        <div className="container">
          <h1 className="checkout-page__title">Checkout</h1>
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`checkout-step ${i <= step ? 'active' : ''}`}>
                <span className="checkout-step__num">{i + 1}</span>
                <span className="checkout-step__label">{s}</span>
                {i < STEPS.length - 1 && <div className="checkout-step__line" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          {/* Left — Form */}
          <div className="checkout-form-area">
            {step === 0 && (
              <form onSubmit={handleShippingSubmit} className="checkout-section">
                <h2 className="checkout-section__title">Shipping Information</h2>

                {!user && (
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="For order confirmation" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required />
                  </div>
                )}

                <div className="checkout-name-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input type="text" name="firstName" className="form-input" value={shipping.firstName} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="lastName" className="form-input" value={shipping.lastName} onChange={handleShippingChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" name="street" className="form-input" placeholder="123 Main Street" value={shipping.street} onChange={handleShippingChange} required />
                </div>

                <div className="checkout-city-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-input" value={shipping.city} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province</label>
                    <input type="text" name="state" className="form-input" value={shipping.state} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input type="text" name="postalCode" className="form-input" value={shipping.postalCode} onChange={handleShippingChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input type="text" name="country" className="form-input" value={shipping.country} onChange={handleShippingChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-input" placeholder="+1 (555) 000-0000" value={shipping.phone} onChange={handleShippingChange} />
                </div>

                <button type="submit" className="btn btn-primary checkout-submit-btn">
                  Continue to Payment →
                </button>
              </form>
            )}

            {step === 1 && (
              <div className="checkout-section">
                <h2 className="checkout-section__title">Payment</h2>

                <div className="checkout-shipping-summary">
                  <div className="checkout-shipping-summary__header">
                    <span>Shipping to</span>
                    <button className="checkout-edit-btn" onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p>{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.street}, {shipping.city}, {shipping.state} {shipping.postalCode}, {shipping.country}</p>
                </div>

                <div className="checkout-payment-form">
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" name="number" className="form-input" placeholder="1234 5678 9012 3456" value={cardInfo.number} onChange={handleCardChange} maxLength={19} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" name="name" className="form-input" placeholder="As appears on card" value={cardInfo.name} onChange={handleCardChange} />
                  </div>
                  <div className="checkout-card-row">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input type="text" name="expiry" className="form-input" placeholder="MM / YY" value={cardInfo.expiry} onChange={handleCardChange} maxLength={7} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVC</label>
                      <input type="text" name="cvc" className="form-input" placeholder="•••" value={cardInfo.cvc} onChange={handleCardChange} maxLength={4} />
                    </div>
                  </div>

                  <div className="checkout-secure-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Secured with 256-bit SSL encryption · Powered by Stripe</span>
                  </div>
                </div>

                <button className="btn btn-primary checkout-submit-btn" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : `Place Order · $${totalAmount.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="checkout-summary">
            <h3 className="checkout-summary__title">Order Summary</h3>
            <div className="checkout-summary__items">
              {cartItems.map(item => (
                <div key={item._id} className="checkout-summary__item">
                  <div className="checkout-summary__item-img">
                    {item.thumbnailImage ? <img src={item.thumbnailImage} alt={item.name} /> : <div style={{ background: 'var(--moonlight)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--champagne-light)' }}>✦</div>}
                    <span className="checkout-summary__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__item-info">
                    <p className="checkout-summary__item-name">{item.name}</p>
                  </div>
                  <span className="checkout-summary__item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Tax (8%)</span><span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="checkout-summary__total">
                <span>Total</span><span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

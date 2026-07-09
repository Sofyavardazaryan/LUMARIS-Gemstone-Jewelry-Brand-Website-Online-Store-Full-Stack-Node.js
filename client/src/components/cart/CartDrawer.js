import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, itemCount, shippingCost, totalAmount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      )}

      <div className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">Your Cart ({itemCount})</h3>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {/* Items */}
        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p>Your cart is empty</p>
              <button className="btn btn-outline" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item__image">
                  {item.thumbnailImage ? (
                    <img src={item.thumbnailImage} alt={item.name} />
                  ) : (
                    <div className="cart-item__image-placeholder">✦</div>
                  )}
                </div>
                <div className="cart-item__details">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <p className="cart-item__price">${item.price.toFixed(2)}</p>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item__right">
                  <span className="cart-item__total">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotals">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-drawer__row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="cart-drawer__shipping-note">
                  Add ${(150 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
            <button className="btn btn-primary cart-drawer__checkout" onClick={handleCheckout}>
              Proceed to Checkout — ${totalAmount.toFixed(2)}
            </button>
            <Link to="/shop" className="cart-drawer__continue" onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

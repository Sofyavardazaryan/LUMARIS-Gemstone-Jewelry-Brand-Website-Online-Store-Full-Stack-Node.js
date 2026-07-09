import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(console.error);
    }
  }, [id]);

  return (
    <div className="order-success-page">
      <div className="order-success-content">
        <div className="order-success__icon">✦</div>
        <h1 className="order-success__title">Order Confirmed</h1>
        <div className="divider" />
        <p className="order-success__msg">
          Thank you for your order. You'll receive a confirmation email shortly.
        </p>

        {order && (
          <div className="order-success__details">
            <div className="order-success__row">
              <span>Order Number</span>
              <span className="order-success__value">{order.orderNumber}</span>
            </div>
            <div className="order-success__row">
              <span>Total</span>
              <span className="order-success__value">${order.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="order-success__row">
              <span>Status</span>
              <span className="order-success__status">{order.status}</span>
            </div>
          </div>
        )}

        <div className="order-success__actions">
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          <Link to="/account/orders" className="btn btn-outline">View My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

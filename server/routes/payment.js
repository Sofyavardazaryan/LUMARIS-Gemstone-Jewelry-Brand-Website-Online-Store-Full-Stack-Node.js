const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { optionalAuth } = require('../middleware/auth');

// Stripe is only initialised when a real key is configured. Until then the app
// runs in demo mode (the checkout flow already simulates payment confirmation),
// and automatically uses live Stripe once a valid key is set in .env.
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = !!stripeKey && stripeKey.startsWith('sk_') && !stripeKey.includes('your_stripe');
const stripe = isStripeConfigured ? require('stripe')(stripeKey) : null;

if (!isStripeConfigured) {
  console.warn('⚠ Stripe not configured — payments run in DEMO mode (no real charges).');
}

// @route   POST /api/payment/create-payment-intent
router.post('/create-payment-intent', optionalAuth, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    // Demo mode: return a mock client secret so checkout completes without a live Stripe account.
    if (!stripe) {
      return res.json({
        clientSecret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
        demo: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId || '',
        userId: req.user?._id?.toString() || 'guest'
      },
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment/webhook — Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe not configured — webhook unavailable in demo mode.' });
  }
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: new Date(),
          status: 'confirmed',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            updateTime: new Date().toISOString(),
            email: paymentIntent.receipt_email
          }
        });
      }
      break;
    }
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// @route   GET /api/payment/config — Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = router;

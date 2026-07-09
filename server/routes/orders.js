const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

// @route   POST /api/orders — Create order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, guestEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify products and calculate totals
    let subtotal = 0;
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      subtotal += product.price * item.quantity;
      return {
        product: product._id,
        name: product.name,
        image: product.thumbnailImage,
        price: product.price,
        quantity: item.quantity
      };
    }));

    const shippingCost = subtotal >= 150 ? 0 : 12; // Free shipping over $150
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + shippingCost + taxAmount;

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestEmail: !req.user ? guestEmail : undefined,
      items: enrichedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      subtotal,
      shippingCost,
      taxAmount,
      totalAmount,
      couponCode
    });

    // Decrement stock
    await Promise.all(enrichedItems.map(item =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      })
    ));

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/orders/my — Get current user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Users can only see their own orders; admins can see all
    if (req.user.role !== 'admin' && order.user?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/pay — Mark as paid (supports guest checkout)
router.put('/:id/pay', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If the order belongs to a registered user, only that user (or an admin) may pay it.
    // Guest orders (no order.user) are payable without authentication.
    if (order.user && (!req.user || (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';
    order.paymentResult = req.body;

    const updated = await order.save();

    // Send confirmation email
    const emailTo = order.user?.email || order.guestEmail;
    const emailName = order.user?.firstName || order.shippingAddress.firstName;
    if (emailTo) {
      sendEmail({
        to: emailTo,
        subject: `Lumaris — Order Confirmed #${order.orderNumber}`,
        html: emailTemplates.orderConfirmation(order, emailName)
      }).catch(console.error);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

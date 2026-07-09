const express = require('express');
const router = express.Router();
const Gemstone = require('../models/Gemstone');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = { isActive: true };
    if (featured === 'true') filter.isFeatured = true;

    const gemstones = await Gemstone.find(filter).sort({ name: 1 });
    res.json(gemstones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const gemstone = await Gemstone.findOne({ slug: req.params.slug, isActive: true });
    if (!gemstone) return res.status(404).json({ message: 'Gemstone not found' });

    const products = await Product.find({ gemstone: gemstone._id, isActive: true })
      .populate('collection', 'name slug');

    res.json({ gemstone, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const gemstone = await Gemstone.create(req.body);
    res.status(201).json(gemstone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const gemstone = await Gemstone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gemstone) return res.status(404).json({ message: 'Gemstone not found' });
    res.json(gemstone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Gemstone.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Gemstone removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

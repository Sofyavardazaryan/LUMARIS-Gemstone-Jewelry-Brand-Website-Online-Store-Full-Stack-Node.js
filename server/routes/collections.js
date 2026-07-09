const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { type, featured } = req.query;
    const filter = { isActive: true };
    if (type) filter.inspirationType = type;
    if (featured === 'true') filter.isFeatured = true;

    const collections = await Collection.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    const products = await Product.find({ collection: collection._id, isActive: true })
      .populate('gemstone', 'name slug color energeticProperties');

    res.json({ collection, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Collection.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Collection removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

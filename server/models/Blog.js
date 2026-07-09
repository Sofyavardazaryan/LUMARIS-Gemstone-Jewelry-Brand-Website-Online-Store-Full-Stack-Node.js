const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: 'Lumaris Team' },
  coverImage: String,
  excerpt: String,
  content: { type: String, required: true }, // Rich text / markdown
  category: {
    type: String,
    enum: ['gemstone-energy', 'collection-story', 'symbolism', 'styling', 'history', 'craftsmanship'],
    required: true
  },
  tags: [String],
  relatedGemstone: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' },
  relatedCollection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  isFeatured: { type: Boolean, default: false },
  readTime: Number, // estimated minutes
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);

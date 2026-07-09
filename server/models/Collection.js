const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  subtitle: String,
  coverImage: String,
  galleryImages: [String],
  inspirationType: {
    type: String,
    enum: ['person', 'city', 'literature', 'cinema', 'event', 'era', 'other'],
    required: true
  },
  inspiration: String, // e.g. "Dante Alighieri", "Florence", "Wuthering Heights"
  era: String,         // e.g. "Renaissance", "Victorian"
  storyIntroduction: { type: String, required: true },
  historicalBackground: String,
  emotionalMeaning: String,
  gemstoneConnection: String, // How gemstone energy connects to inspiration
  quote: String,
  quoteAuthor: String,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);

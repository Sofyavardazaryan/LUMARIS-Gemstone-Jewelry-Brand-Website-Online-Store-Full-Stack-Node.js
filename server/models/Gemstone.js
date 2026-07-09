const mongoose = require('mongoose');

const gemstoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  images: [String],
  thumbnailImage: String,
  color: String,
  mohs: { type: Number, min: 1, max: 10 }, // Hardness scale
  origin: { type: String }, // Geological origin
  description: { type: String, required: true },
  geologicalBackground: String,
  symbolism: String,
  emotionalProperties: String,
  energeticProperties: { type: String, required: true },
  spiritualAssociations: String,
  chakra: String,
  zodiacSign: [String],
  planet: String,
  element: String,
  careInstructions: String,
  funFacts: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gemstone', gemstoneSchema);

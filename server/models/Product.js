const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  sku: { type: String, unique: true },
  category: {
    type: String,
    enum: ['bracelets', 'necklaces', 'pendants', 'rings', 'earrings', 'sets'],
    required: true
  },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  gemstone: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' },
  images: [String],
  thumbnailImage: String,
  shortDescription: String,
  description: { type: String, required: true }, // Storytelling description
  materials: [String], // e.g. ['Sterling Silver', 'Amethyst', '18K Gold Plating']
  dimensions: {
    length: String,
    width: String,
    weight: String
  },
  energeticMeaning: String,  // Gemstone energy for this specific piece
  careInstructions: String,
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: Number,    // Original price (for sale display)
  stock: { type: Number, required: true, default: 0 },
  isInStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }
}, { timestamps: true, suppressReservedKeysWarning: true });

// Update isInStock based on stock quantity
productSchema.pre('save', function (next) {
  this.isInStock = this.stock > 0;
  next();
});

// Recalculate average rating
productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = Math.round((total / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);

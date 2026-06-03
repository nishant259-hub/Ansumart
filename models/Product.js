// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  image:       { type: String },                    // primary image (backwards compat)
  images:      { type: [String], default: [] },     // 2+ angle images
  category:    { type: String, required: true, trim: true },
  description: { type: String, default: '' },
}, { timestamps: true });

// Virtual: return images array if present, else wrap single image
productSchema.virtual('allImages').get(function () {
  if (this.images && this.images.length > 0) return this.images;
  if (this.image) return [this.image];
  return [];
});

productSchema.set('toJSON',   { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
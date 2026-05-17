// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: '📦' },
  label: { type: String, trim: true }, // short display label
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

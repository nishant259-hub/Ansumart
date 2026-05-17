// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:     { type: String, required: true },
      price:    { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      image:    { type: String }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },

  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'upi'],
    default: 'cod'
  },

  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },

  deliveryAddress: {
    line:    String,
    city:    String,
    state:   String,
    pincode: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
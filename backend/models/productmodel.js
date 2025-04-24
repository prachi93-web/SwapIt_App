// models/SwapItem.js
const mongoose = require('mongoose');

const SwapItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  wants: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Kitchen', 'Books', 'Clothing', 'Furniture', 'Others'], // Customize as needed
    required: true,
  },
  imageUris: {
    type: [String], // Array of image URLs or base64 strings if stored locally
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.productmodel || mongoose.model("productmodel", SwapItemSchema);


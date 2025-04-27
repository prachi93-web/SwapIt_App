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
    enum: ['Electronic Appliances', 'Kitchen Appliances', 'Furniture', 'Toys and Sports', 'Men"s Wear', 'Women"s Wear', 'Footwear', 'Accessories', 'Mobile Phones', 'Computers & Laptops', 'Gaming Consoles', 'Cameras & Photography', 'Academic Books', 'Novels & Comics', 'Office Supplies', 'Bicycle', 'Motorcycle & Scooter','Car Accessories'], // Customize as needed
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


const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  imageUri: {
    type: String,
    required: true
  },
  requesterId: {
    type: String,
    required: true
  },
  requesterName: {
    type: String,
    required: true
  },
  requesterContact: {
    type: String,
    required: true // now stores the user's email address
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wants: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Item', itemSchema);

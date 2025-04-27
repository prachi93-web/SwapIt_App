const express = require('express');
const router = express.Router();
const Item = require('../models/productmodel.js');

// GET all items
router.get('/items', async (req, res) => {
  try {
    console.log('Fetching all items...');
    const items = await Item.find().sort({ createdAt: -1 });
    console.log(`Found ${items.length} items`);
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Server error while fetching items' });
  }
});

// GET items by category
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('Fetching items for category:', category);
    
    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    const items = await Item.find({ category }).sort({ createdAt: -1 });
    console.log(`Found ${items.length} items for category ${category}`);
    res.json(items);
  } catch (err) {
    console.error('Error fetching items by category:', err);
    res.status(500).json({ error: 'Server error while fetching items by category' });
  }
});

module.exports = router;

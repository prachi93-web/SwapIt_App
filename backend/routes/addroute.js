const express = require('express');
const multer = require("multer");
const { cloudinary, storage } = require('../cloudinary.js');
const SwapItem = require('../models/productmodel.js');
const router = express.Router();
const upload = multer({ storage });

router.post('/', async (req, res) => {
  try {
    const { productName, wants, city, pinCode, category, imageUris } = req.body;

    // Validate all required fields
    if (
      !productName ||
      !wants ||
      !city ||
      !pinCode ||
      !category ||
      !imageUris ||
      !Array.isArray(imageUris) ||
      imageUris.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newItem = new SwapItem({
      productName,
      wants,
      city,
      pinCode,
      category,
      imageUris,
    });

    await newItem.save();
    res.status(201).json({ message: "Swap added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await SwapItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch items" });
  }
});

module.exports = router;

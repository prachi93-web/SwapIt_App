// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadm');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // Cloudinary URL
    // Save to MongoDB if needed
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;

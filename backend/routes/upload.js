// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadm');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Upload successful:', req.file);
    const imageUrl = req.file.path; // Cloudinary URL

    res.status(200).json({ 
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed',
      error: error.message 
    });
  }
});

module.exports = router;

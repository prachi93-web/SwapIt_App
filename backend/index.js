// Load environment variables as early as possible
require('dotenv').config();

// Debug logs to confirm env is loaded
console.log('Mongo URI is', process.env.MONGODB_URI);
console.log('Cloud name is', process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Your routes
const swapRoutes = require('./routes/addroute.js');
const uploadRoute = require('./routes/upload.js');
const itemsRoute = require('./routes/items');
const swapRequestsRoute = require('./routes/swapRequests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Mount routes
app.use('/api/swaps', swapRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api', itemsRoute);
app.use('/api/swap-requests', swapRequestsRoute);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📝 Available routes:');
      console.log('   - POST /api/upload');
      console.log('   - POST /api/swap-requests');
      console.log('   - GET /api/swap-requests');
      console.log('   - PATCH /api/swap-requests/:requestId');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: err.message });
});

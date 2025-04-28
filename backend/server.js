const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://psmehetre370122:swapit@cluster0.aoqulru.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/swap-requests', require('./routes/swapRequests'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api', require('./routes/items'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - GET /api/test`);
  console.log(`   - POST /api/upload`);
  console.log(`   - POST /api/swap-requests`);
  console.log(`   - GET /api/swap-requests`);
  console.log(`   - PATCH /api/swap-requests/:requestId`);
}); 
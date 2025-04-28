const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest.js');

// Create a new swap request
router.post('/', async (req, res) => {
  try {
    console.log('Received swap request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['productName', 'city', 'pincode', 'imageUri', 'requesterId', 'requesterName', 'requesterContact'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Create new swap request
    const swapRequest = new SwapRequest({
      productName: req.body.productName,
      city: req.body.city,
      pincode: req.body.pincode,
      imageUri: req.body.imageUri,
      requesterId: req.body.requesterId,
      requesterName: req.body.requesterName,
      requesterContact: req.body.requesterContact,
      status: 'pending',
      createdAt: new Date()
    });

    console.log('Creating swap request:', JSON.stringify(swapRequest, null, 2));

    // Save to MongoDB
    const savedRequest = await swapRequest.save();
    console.log('Swap request saved successfully:', JSON.stringify(savedRequest, null, 2));

    // Send success response
    res.status(201).json({
      message: 'Swap request created successfully',
      request: savedRequest
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ message: 'Error creating swap request', error: error.message });
  }
});

// Get swap requests for a specific user (as product owner)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('Fetching requests for userId:', userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find all swap requests where the requester is NOT the current user (i.e., requests sent to the user)
    const requests = await SwapRequest.find({ requesterId: { $ne: userId } })
      .sort({ createdAt: -1 });
    
    console.log('Found requests:', JSON.stringify(requests, null, 2));
    res.json(requests);
  } catch (error) {
    console.error('Error fetching swap requests:', error);
    res.status(500).json({ message: 'Error fetching swap requests', error: error.message });
  }
});

// Update swap request status
router.patch('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    console.log('Updating request:', requestId, 'to status:', status);
    
    if (!['pending', 'accepted', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Request updated successfully:', request);
    res.json(request);
  } catch (error) {
    console.error('Error updating swap request:', error);
    res.status(500).json({ message: 'Error updating swap request', error: error.message });
  }
});

module.exports = router; 
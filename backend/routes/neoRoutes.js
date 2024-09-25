const express = require('express');
const router = express.Router();
const neoController = require('../controllers/neoController');

// Existing routes
router.get('/', neoController.getNEOs);
router.get('/:id', neoController.getNEOById);
router.post('/store', neoController.storeNEOData);

// New routes
router.get('/search', neoController.searchNEOs);
router.get('/hazardous', neoController.getHazardousNEOs);
router.get('/closest', neoController.getClosestApproach);
router.get('/diameter-range', neoController.getNEOsByDiameterRange);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'NEO routes test is working' });
});

module.exports = router;
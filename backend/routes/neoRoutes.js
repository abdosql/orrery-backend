const express = require('express');
const router = express.Router();
const neoController = require('../controllers/neoController');

// NEO data endpoints
router.get('/', neoController.getNEOs);
router.get('/:id', neoController.getNEOById);

// Additional NEO data endpoints
router.get('/search', neoController.searchNEOs);
router.get('/hazardous', neoController.getHazardousNEOs);
router.get('/closest', neoController.getClosestApproach);
router.get('/diameter-range', neoController.getNEOsByDiameterRange);

module.exports = router;fi
const express = require('express');
const router = express.Router();
const neoController = require('../controllers/neoController');

// NEO data endpoints
router.get('/', neoController.getNEOs);
router.get('/search', neoController.searchNEOs);
router.get('/hazardous', neoController.getHazardousNEOs);
router.get('/closest', neoController.getClosestApproach);
router.get('/diameter-range', neoController.getNEOsByDiameterRange);
router.get('/:id', neoController.getNEOById);

module.exports = router;
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

// Routes for other entities
router.get('/observations', neoController.getObservations);
router.post('/observations', neoController.addObservation);
router.get('/risk-assessments', neoController.getRiskAssessments);
router.post('/risk-assessments', neoController.addRiskAssessment);
router.get('/simulations', neoController.getSimulationResults);
router.post('/simulations', neoController.runSimulation);

module.exports = router;
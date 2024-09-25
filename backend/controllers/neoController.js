const { getNEOFeed, getNEOLookup, getESANEOData } = require('../services/nasaService');
const NEO = require('../models/neo'); // You'll need to create this model

exports.getNEOs = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    console.log('Fetching NEO data for:', start_date, end_date);
    
    const [nasaData, esaData] = await Promise.all([
      getNEOFeed(start_date, end_date),
      getESANEOData()
    ]);
    
    console.log('NASA data fetched:', !!nasaData);
    console.log('ESA data fetched:', !!esaData);
    
    const combinedData = {
      nasa: nasaData,
      esa: esaData
    };
    
    res.json(combinedData);
  } catch (error) {
    console.error('Error in getNEOs:', error);
    res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
  }
};

exports.getNEOById = async (req, res) => {
  try {
    const { id } = req.params;
    const neoData = await getNEOLookup(id);
    res.json(neoData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
  }
};

exports.storeNEOData = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const neoData = await getNEOFeed(start_date, end_date);
    
    // Store the data in MongoDB
    await NEO.insertMany(neoData.near_earth_objects);
    
    res.json({ message: 'NEO data stored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error storing NEO data', error: error.message });
  }
};

exports.searchNEOs = async (req, res) => {
  try {
    const { query } = req.query;
    const neos = await NEO.find({ $text: { $search: query } });
    res.json(neos);
  } catch (error) {
    res.status(500).json({ message: 'Error searching NEOs', error: error.message });
  }
};

exports.getHazardousNEOs = async (req, res) => {
  try {
    const hazardousNEOs = await NEO.find({ is_potentially_hazardous_asteroid: true });
    res.json(hazardousNEOs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hazardous NEOs', error: error.message });
  }
};

exports.getClosestApproach = async (req, res) => {
  try {
    const closestNEOs = await NEO.find().sort({ 'close_approach_data.miss_distance.kilometers': 1 }).limit(10);
    res.json(closestNEOs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching closest NEOs', error: error.message });
  }
};

// Add this method for diameter range search
exports.getNEOsByDiameterRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    const neos = await NEO.find({
      'estimated_diameter.kilometers.min': { $gte: parseFloat(min) },
      'estimated_diameter.kilometers.max': { $lte: parseFloat(max) }
    });
    res.json(neos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NEOs by diameter range', error: error.message });
  }
};

module.exports = {
  getNEOs,
  getNEOById,
  storeNEOData,
  searchNEOs,
  getHazardousNEOs,
  getClosestApproach,
  getNEOsByDiameterRange,
  // Add any other functions you've defined
};
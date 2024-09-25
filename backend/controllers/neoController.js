const { getNEOFeed, getNEOLookup, getESANEOData } = require('../services/nasaService');
const NEO = require('../models/neo');

exports.getNEOs = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const [nasaData, esaData] = await Promise.all([
      getNEOFeed(start_date, end_date),
      getESANEOData()
    ]);
    
    const combinedData = {
      nasa: nasaData,
      esa: esaData
    };
    
    // Store the combined data in the database
    await NEO.insertMany(combinedData.nasa.near_earth_objects.flat());
    
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

// Add a new function to update the database periodically
exports.updateNEODatabase = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [nasaData, esaData] = await Promise.all([
      getNEOFeed(today, sevenDaysLater),
      getESANEOData()
    ]);
    
    // Update or insert NASA data
    for (const neo of nasaData.near_earth_objects.flat()) {
      await NEO.findOneAndUpdate(
        { neo_reference_id: neo.neo_reference_id },
        neo,
        { upsert: true, new: true }
      );
    }
    
    // Update or insert ESA data (assuming ESA data structure)
    for (const neo of esaData) {
      await NEO.findOneAndUpdate(
        { neo_reference_id: neo.neo_reference_id },
        neo,
        { upsert: true, new: true }
      );
    }
    
    console.log('NEO database updated successfully');
  } catch (error) {
    console.error('Error updating NEO database:', error);
  }
};

module.exports = {
  getNEOs,
  getNEOById,
  searchNEOs,
  getHazardousNEOs,
  getClosestApproach,
  getNEOsByDiameterRange,
};
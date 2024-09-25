const { getNEOFeed, getNEOLookup } = require('../services/nasaService');
const NEO = require('../models/neo');

exports.getNEOs = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Check if we have data for this date range in the database
    const existingData = await NEO.find({
      'close_approach_data.close_approach_date': {
        $gte: start_date,
        $lte: end_date
      }
    });

    if (existingData.length > 0) {
      // If we have data in the database, return it
      return res.json({
        element_count: existingData.length,
        near_earth_objects: existingData
      });
    }

    // If no data in database, fetch from NASA API
    const data = await getNEOFeed(start_date, end_date);

    const neos = Object.values(data.near_earth_objects).flat();
    
    // Store the fetched data in the database
    for (const neo of neos) {
      await NEO.findOneAndUpdate(
        { neo_reference_id: neo.neo_reference_id },
        neo,
        { upsert: true, new: true }
      );
    }

    res.json({
      element_count: data.element_count,
      near_earth_objects: data.near_earth_objects
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
  }
};

exports.getNEOById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the NEO exists in our database
    let neo = await NEO.findOne({ neo_reference_id: id });
    
    if (!neo) {
      // If not in database, fetch from NASA API
      const data = await getNEOLookup(id);
      // Store the fetched data in the database
      neo = await NEO.create(data);
    }
    
    res.json(neo);
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
    const closestNEOs = await NEO.find()
      .sort({ 'close_approach_data.miss_distance.kilometers': 1 })
      .limit(10);
    res.json(closestNEOs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching closest NEOs', error: error.message });
  }
};

exports.getNEOsByDiameterRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    const neos = await NEO.find({
      'estimated_diameter.kilometers.estimated_diameter_min': { $gte: parseFloat(min) },
      'estimated_diameter.kilometers.estimated_diameter_max': { $lte: parseFloat(max) }
    });
    res.json(neos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NEOs by diameter range', error: error.message });
  }
};
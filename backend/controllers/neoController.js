const { getNEOFeed, getNEOLookup } = require('../services/nasaService');

exports.getNEOs = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const data = await getNEOFeed(start_date, end_date);
    res.json(data);
  } catch (error) {
    console.error('Error in getNEOs:', error);
    res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
  }
};

exports.getNEOById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getNEOLookup(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NEO data', error: error.message });
  }
};

// ... other controller methods ...
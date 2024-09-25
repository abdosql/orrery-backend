const axios = require('axios');
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

console.log('NASA API Key:', NASA_API_KEY); // Add this line

async function getNEOFeed(startDate, endDate) {
  if (!NASA_API_KEY) {
    throw new Error('NASA API Key is not set');
  }
  try {
    const response = await axios.get(`${NASA_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO feed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    throw error;
  }
}

async function getNEOLookup(asteroidId) {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/neo/${asteroidId}`, {
      params: { api_key: NASA_API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO lookup:', error.message);
    throw error;
  }
}

module.exports = { getNEOFeed, getNEOLookup };
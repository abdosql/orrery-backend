const axios = require('axios');
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

async function getNEOFeed(startDate, endDate) {
  const response = await axios.get(`${NASA_BASE_URL}/feed`, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: NASA_API_KEY
    }
  });
  return response.data;
}

async function getNEOLookup(asteroidId) {
  const response = await axios.get(`${NASA_BASE_URL}/neo/${asteroidId}`, {
    params: { api_key: NASA_API_KEY }
  });
  return response.data;
}

module.exports = { getNEOFeed, getNEOLookup };
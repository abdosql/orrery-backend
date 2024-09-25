const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const ESA_BASE_URL = 'https://neo.ssa.esa.int/api/neo';

async function getNEOFeed(startDate, endDate) {
  const cacheKey = `neo_feed_${startDate}_${endDate}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get(`${NASA_BASE_URL}/feed`, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: NASA_API_KEY
    }
  });

  cache.set(cacheKey, response.data);
  return response.data;
}

async function getNEOLookup(asteroidId) {
  const cacheKey = `neo_lookup_${asteroidId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get(`${NASA_BASE_URL}/neo/${asteroidId}`, {
    params: { api_key: NASA_API_KEY }
  });

  cache.set(cacheKey, response.data);
  return response.data;
}

async function getESANEOData() {
  const cacheKey = 'esa_neo_data';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get(`${ESA_BASE_URL}`);
  cache.set(cacheKey, response.data, 3600); // Cache for 1 hour
  return response.data;
}

module.exports = { getNEOFeed, getNEOLookup, getESANEOData };
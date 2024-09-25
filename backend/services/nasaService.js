const axios = require('axios');
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

async function getNEOFeed(startDate, endDate) {
  let logs = [];
  try {
    logs.push(`Fetching NEO feed for dates: ${startDate} to ${endDate}`);
    const response = await axios.get(`${NASA_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY
      }
    });
    logs.push('NEO feed data received successfully');
    return { data: response.data, logs };
  } catch (error) {
    logs.push(`Error fetching NEO feed: ${error.message}`);
    throw { error, logs };
  }
}

async function getNEOLookup(asteroidId) {
  let logs = [];
  try {
    logs.push(`Fetching NEO lookup for ID: ${asteroidId}`);
    const response = await axios.get(`${NASA_BASE_URL}/neo/${asteroidId}`, {
      params: { api_key: NASA_API_KEY }
    });
    logs.push('NEO lookup data received successfully');
    return { data: response.data, logs };
  } catch (error) {
    logs.push(`Error fetching NEO lookup: ${error.message}`);
    throw { error, logs };
  }
}

module.exports = { getNEOFeed, getNEOLookup };
# API Documentation

## Environment Setup

Before running the application, ensure you have set up the following environment variables:

- `NASA_API_KEY`: Your NASA API key. You can obtain one from https://api.nasa.gov/

## Endpoints

### GET /api/neos

Fetches NEO data for a given date range.

Query Parameters:
- `start_date`: Start date in YYYY-MM-DD format
- `end_date`: End date in YYYY-MM-DD format

Example: `GET /api/neos?start_date=2023-05-01&end_date=2023-05-07`

### GET /api/neos/:id

Fetches detailed information about a specific NEO.

Path Parameters:
- `id`: The NEO ID

Example: `GET /api/neos/3542519`

... (include other endpoints as needed)
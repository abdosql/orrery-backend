# NEO (Near Earth Object) API Documentation

## Base URL

All API requests should be made to: `http://38.242.248.47:5090/api`

## Authentication

Currently, the API does not require authentication for NEO endpoints. However, user-related endpoints (register and login) require appropriate credentials.

## Endpoints

### 1. Get NEOs

Retrieves a list of Near Earth Objects for a given date range.

- **URL:** `/neos`
- **Method:** GET
- **URL Params:** 
  - `start_date=[YYYY-MM-DD]` (required)
  - `end_date=[YYYY-MM-DD]` (required)
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "apiKeyStatus": "API Key is set: WxfeB...",
      "element_count": 123,
      "near_earth_objects": [
        {
          "id": "2021277",
          "neo_reference_id": "2021277",
          "name": "(2021 GT3)",
          "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2021277",
          "absolute_magnitude_h": 23.1,
          "estimated_diameter": {
            "kilometers": {
              "estimated_diameter_min": 0.0608912789,
              "estimated_diameter_max": 0.1361570015
            },
            "meters": {
              "estimated_diameter_min": 60.8912789258,
              "estimated_diameter_max": 136.1570015386
            }
          },
          "is_potentially_hazardous_asteroid": false,
          "close_approach_data": [
            {
              "close_approach_date": "2023-05-01",
              "close_approach_date_full": "2023-May-01 09:46",
              "epoch_date_close_approach": 1682932360000,
              "relative_velocity": {
                "kilometers_per_second": "6.0334697797",
                "kilometers_per_hour": "21720.4912068756",
                "miles_per_hour": "13496.2540140689"
              },
              "miss_distance": {
                "astronomical": "0.2804752966",
                "lunar": "109.1048903774",
                "kilometers": "41958513.840256442",
                "miles": "26071801.6252820196"
              },
              "orbiting_body": "Earth"
            }
          ],
          "is_sentry_object": false
        },
        // ... more NEO objects
      ]
    }
    ```
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error fetching NEO data", "error": "Error message" }`

### 2. Get NEO by ID

Retrieves detailed information about a specific NEO.

- **URL:** `/neos/:id`
- **Method:** GET
- **URL Params:** 
  - `id=[string]` (required)
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```json
    {
      "id": "2021277",
      "neo_reference_id": "2021277",
      "name": "(2021 GT3)",
      // ... (same structure as in the GET NEOs response)
    }
    ```
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error fetching NEO data", "error": "Error message" }`

### 3. Search NEOs

Searches for NEOs based on a query string.

- **URL:** `/neos/search`
- **Method:** GET
- **URL Params:** 
  - `query=[string]` (required)
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of NEO objects matching the search query
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error searching NEOs", "error": "Error message" }`

### 4. Get Hazardous NEOs

Retrieves a list of potentially hazardous NEOs.

- **URL:** `/neos/hazardous`
- **Method:** GET
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of potentially hazardous NEO objects
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error fetching hazardous NEOs", "error": "Error message" }`

### 5. Get Closest Approach NEOs

Retrieves a list of NEOs with the closest approach to Earth.

- **URL:** `/neos/closest`
- **Method:** GET
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of NEO objects sorted by closest approach
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error fetching closest NEOs", "error": "Error message" }`

### 6. Get NEOs by Diameter Range

Retrieves NEOs within a specified diameter range.

- **URL:** `/neos/diameter-range`
- **Method:** GET
- **URL Params:** 
  - `min=[float]` (required)
  - `max=[float]` (required)
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of NEO objects within the specified diameter range
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "message": "Error fetching NEOs by diameter range", "error": "Error message" }`

## User Authentication Endpoints

### 7. Register User

Registers a new user.

- **URL:** `/users/register`
- **Method:** POST
- **Data Params:** 
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT_TOKEN" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "msg": "User already exists" }`

### 8. Login User

Authenticates a user and returns a token.

- **URL:** `/users/login`
- **Method:** POST
- **Data Params:** 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT_TOKEN" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "msg": "Invalid credentials" }`

## Notes

- The API uses MongoDB to cache NEO data. If data for a specific date range exists in the database, it will be returned instead of making a new request to the NASA API.
- The NASA API key is required for fetching new data from NASA. Ensure it's properly set in your environment variables.
- All dates should be in the format YYYY-MM-DD.
- The diameter range for NEOs is in kilometers.
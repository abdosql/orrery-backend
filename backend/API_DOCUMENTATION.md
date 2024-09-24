# Orrery Backend API Documentation

## Base URL
All endpoints are relative to: `http://localhost:5000/api`

## Authentication Endpoints

### Register a New User
- **URL:** `/users/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT_TOKEN_HERE" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "msg": "Please enter all fields" }`
  - **Content:** `{ "msg": "User already exists" }`
  - **Code:** 500
  - **Content:** `"Server error"`

### Login User
- **URL:** `/users/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT_TOKEN_HERE" }`
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "msg": "Please enter all fields" }`
  - **Content:** `{ "msg": "User does not exist" }`
  - **Content:** `{ "msg": "Invalid credentials" }`
  - **Code:** 500
  - **Content:** `"Server error"`

## Notes
- All successful authentication requests return a JWT token which should be included in the header of subsequent requests to protected routes.
- The JWT token expires after 1 hour.
- Passwords are hashed using bcrypt before being stored in the database.
- The API uses MongoDB for data storage.
- CORS is enabled for all origins.

## Error Handling
- All endpoints return appropriate HTTP status codes and error messages in case of failures.
- Server errors are logged to the console.

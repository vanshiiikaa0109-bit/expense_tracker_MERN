// src/constants/statusCodes.js
// Standard HTTP status codes used across controllers and middleware

export const STATUS_CODES = {
  // 2xx Success
  OK: 200,                    // Successful GET, PUT, PATCH, DELETE
  CREATED: 201,               // Successful POST (resource created)
  NO_CONTENT: 204,            // Successful DELETE (no response body)

  // 3xx Redirection
  NOT_MODIFIED: 304,          // Resource not modified (caching)

  // 4xx Client Errors
  BAD_REQUEST: 400,           // Invalid request body / params
  UNAUTHORIZED: 401,          // Not authenticated
  FORBIDDEN: 403,             // Authenticated but not authorized
  NOT_FOUND: 404,             // Resource not found
  CONFLICT: 409,              // Duplicate resource (e.g. email already exists)
  UNPROCESSABLE: 422,         // Validation failed
  TOO_MANY_REQUESTS: 429,     // Rate limit exceeded

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500, // Unexpected server error
  BAD_GATEWAY: 502,           // Upstream service error
  SERVICE_UNAVAILABLE: 503,   // Server temporarily unavailable
};

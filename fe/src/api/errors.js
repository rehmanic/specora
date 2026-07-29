/**
 * Custom error classes for the API layer.
 *
 * All errors extend the built-in Error so existing `catch` blocks and
 * `err.message` continue to work. The extra properties (status, data,
 * endpoint) allow callers to make smarter decisions when needed:
 *
 *   if (err instanceof AuthenticationError) { redirect("/login"); }
 */

// ─── Base ────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  /**
   * @param {string}  message  – human-readable error description
   * @param {object}  options
   * @param {number}  [options.status]   – HTTP status code (if available)
   * @param {*}       [options.data]     – parsed response body (if available)
   * @param {string}  [options.endpoint] – the endpoint that was called
   */
  constructor(message, { status, data, endpoint } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? null;
    this.data = data ?? null;
    this.endpoint = endpoint ?? null;
  }
}

// ─── Subtypes ────────────────────────────────────────────────────────────────

/** fetch() itself failed – user is offline, DNS failed, CORS blocked, etc. */
export class NetworkError extends ApiError {
  constructor(message = "Network error. Please check your connection and try again.", options = {}) {
    super(message, options);
    this.name = "NetworkError";
  }
}

/** Request was aborted because it exceeded the configured timeout. */
export class TimeoutError extends ApiError {
  constructor(message = "Request timed out. Please try again.", options = {}) {
    super(message, options);
    this.name = "TimeoutError";
  }
}

/** Server responded with 401 Unauthorized. */
export class AuthenticationError extends ApiError {
  constructor(message = "Authentication required. Please log in.", options = {}) {
    super(message, { ...options, status: options.status ?? 401 });
    this.name = "AuthenticationError";
  }
}

/** Server responded with 400 Bad Request or 422 Unprocessable Entity. */
export class ValidationError extends ApiError {
  constructor(message = "Validation failed.", options = {}) {
    super(message, options);
    this.name = "ValidationError";
  }
}

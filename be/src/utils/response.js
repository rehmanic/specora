/**
 * Standard response helpers for consistent API output.
 *
 * These are optional convenience wrappers — controllers can still use
 * `res.status().json()` directly when the standard shape doesn't fit.
 */

/**
 * Send a success response.
 *
 * @param {import("express").Response} res
 * @param {object} data     Payload to include in the response body.
 * @param {number} [status=200]  HTTP status code.
 * @param {string} [message]  Optional human-readable message.
 */
export function success(res, data = {}, status = 200, message) {
  const body = { ...data };
  if (message) body.message = message;
  return res.status(status).json(body);
}

/**
 * Send a paginated response.
 *
 * @param {import("express").Response} res
 * @param {Array} data       The current page of results.
 * @param {object} meta      Pagination metadata (page, limit, total, etc.).
 * @param {number} [status=200]
 */
export function paginated(res, data, meta, status = 200) {
  return res.status(status).json({ data, meta });
}

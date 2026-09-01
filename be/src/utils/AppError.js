/**
 * Custom application error class.
 *
 * - `statusCode` — HTTP status code to send to the client.
 * - `isOperational` — When true, the error message is safe to expose
 *   (e.g. "Project not found"). Non-operational errors are treated as
 *   unexpected bugs and masked with a generic 500 response.
 */
class AppError extends Error {
  /**
   * @param {string} message  Human-readable error message.
   * @param {number} statusCode  HTTP status code (default 500).
   * @param {boolean} [isOperational=true]  Whether this is an expected error.
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace, excluding this constructor from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

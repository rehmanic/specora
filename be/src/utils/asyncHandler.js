/**
 * Wraps an async Express route handler so that rejected promises
 * are automatically forwarded to the Express error-handling middleware
 * via `next(err)`.
 *
 * Usage:
 *   import asyncHandler from "../../utils/asyncHandler.js";
 *
 *   router.get("/items", asyncHandler(async (req, res) => {
 *     const items = await service.getAll();
 *     res.json(items);
 *   }));
 *
 * @param {Function} fn  An async (req, res, next) => {} handler.
 * @returns {Function}   An Express-compatible middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

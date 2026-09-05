import AppError from "../utils/AppError.js";

/**
 * Registers 404 and global error handling middlewares on the Express application.
 * Must be called after all routes have been registered.
 * @param {import("express").Application} app Express application instance
 */
export function registerErrorHandlers(app) {
  // 404 — No matching route found
  app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
  });

  // Global error handler (must have exactly 4 parameters)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational ?? false;

    if (process.env.NODE_ENV === "development") {
      console.error("❌ [Error]", err);
    } else if (!isOperational) {
      console.error("❌ [Unexpected Error]", err);
    }

    res.status(statusCode).json({
      message: isOperational ? err.message : "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  });
}

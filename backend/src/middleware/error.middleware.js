/**
 * Global Express error handler.
 * Must be registered as the last middleware in app.js (after all routes).
 *
 * Handles:
 *   - AppError (operational, known status code)
 *   - Mongoose CastError  → 400 "Invalid ID format"
 *   - Mongoose duplicate  → 409 "Already exists"
 *   - JWT errors          → 401
 *   - Everything else     → 500 (message hidden in production)
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose unique index violation (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] ?? "field";
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Hide internal details in production for non-operational errors
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !err.isOperational) {
    message = "Something went wrong";
  }

  res.status(statusCode).json({ message });
};

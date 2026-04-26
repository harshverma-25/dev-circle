/**
 * Custom error class that lets service functions throw structured errors
 * with a specific HTTP status code instead of always getting 400.
 *
 * Usage:  throw new AppError("Interview not found", 404);
 */
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks it as a known, safe-to-expose error
  }
}

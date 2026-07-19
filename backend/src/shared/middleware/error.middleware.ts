import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom.error.js";
import { Logger } from "../../infrastructure/logger/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "Something went wrong";

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = err.message;
  } else if (err.name === "CastError") {
    // Mongoose invalid object id
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = `Invalid ID format for path: ${err.path}`;
  } else if (err.code === 11000) {
    // Mongoose unique constraint violation
    statusCode = 409;
    code = "EMAIL_ALREADY_EXISTS"; // Default constraint conflict for user emails
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    code = "TOKEN_EXPIRED";
    message = "Token expired";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    code = "FILE_TOO_LARGE";
    message = "Uploaded file exceeds size limit";
  } else if (err.message && (err.message.includes("Only PDF") || err.message.includes("Only JPG, JPEG, PNG, and WEBP") || err.message.includes("formats are allowed"))) {
    statusCode = 415;
    code = "UNSUPPORTED_FILE_TYPE";
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Logger log error
  Logger.error(`${req.method} ${req.originalUrl} - Error: ${message}`, err);

  const isProd = process.env.NODE_ENV === "production";
  const finalMessage = isProd && statusCode === 500 ? "Something went wrong" : message;

  res.status(statusCode).json({
    success: false,
    message: finalMessage,
    error: {
      code
    }
  });
};

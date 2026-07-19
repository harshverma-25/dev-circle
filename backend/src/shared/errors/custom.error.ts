export class CustomError extends Error {
  public readonly isOperational = true;

  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = "Request validation failed") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = "Incorrect email or password", code: string = "INVALID_CREDENTIALS") {
    super(message, 401, code);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = "Permission denied") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Conflict occurred", code: string = "CONFLICT") {
    super(message, 409, code);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

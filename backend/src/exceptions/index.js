class AppException extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.statusCode = statusCode;
    this.name = name || this.constructor.name;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppException {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, 'ValidationError');
    this.errors = errors;
  }
}

class UnauthorizedError extends AppException {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UnauthorizedError');
  }
}

class ForbiddenError extends AppException {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'ForbiddenError');
  }
}

class NotFoundError extends AppException {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NotFoundError');
  }
}

class ConflictError extends AppException {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'ConflictError');
  }
}

class InternalServerError extends AppException {
  constructor(message = 'Internal server error') {
    super(message, 500, 'InternalServerError');
  }
}

class BadRequestError extends AppException {
  constructor(message = 'Bad request') {
    super(message, 400, 'BadRequestError');
  }
}

module.exports = {
  AppException,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadRequestError
};

const { AppException } = require('../../exceptions');

const globalExceptionHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors = [];

  if (err instanceof AppException) {
    statusCode = err.statusCode;
    message = err.message;
    
    if (err.errors && err.errors.length > 0) {
      errors = err.errors;
    }
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = err.message || 'Unauthorized access';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = err.message || 'Access forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Resource not found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = err.message || 'Resource already exists';
  } else if (err.name === 'SyntaxError' && err.body) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  } else if (err.code === '23505') {
    statusCode = 409;
    message = 'Duplicate entry found';
  } else if (err.code === '23503') {
    statusCode = 400;
    message = 'Foreign key constraint violation';
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      name: err.name
    })
  };

  console.error(`[ERROR] ${statusCode} - ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack
  });

  res.status(statusCode).json(response);
};

const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
  });
};

module.exports = {
  globalExceptionHandler,
  handleUncaughtExceptions
};

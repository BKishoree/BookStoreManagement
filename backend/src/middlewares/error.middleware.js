// module.exports = (err, req, res, next) => {

//   res.status(500).json({
//     message: err.message || 'Something went wrong',
//   });
// };
module.exports = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  }

  else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Access forbidden';
  }

  else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

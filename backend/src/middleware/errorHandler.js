// In src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || []
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'An unexpected error occurred';

  res.status(statusCode).json({
    error: 'Internal Server Error',
    message
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`
  });
};
const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.status).json({
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err instanceof AppError) {
    // operational errors are "expected to happen" (ie:server connection failure, invalid user input, request timeout, etc.)
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    // non operational errors will be programmer related errors (bugs)
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// allows for development/production differenciated error handling
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

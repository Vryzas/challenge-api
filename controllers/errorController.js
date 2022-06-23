const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.status).json({
    message: err.message,
    stack: err.stack,
  });
};

// production errors can be foressen and handled explicitly with a specific msg or, unforeseen and handled generically
const sendErrorProd = (err, res) => {
  if (err instanceof AppError) {
    // instances of AppError are foreseen (ie:server connection failure, invalid user input, request timeout, etc.)
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    // generic handler (for programmer related errors/bugs)
    console.error('ERROR', err);
    res.status(500).json({
      message: 'Something went wrong!',
      status: 'error',
    });
  }
};

// allows for development/production differenciated error handling
module.exports = (err, res) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

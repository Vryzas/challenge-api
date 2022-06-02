const AppError = require('./../utils/appError');

// const handleDBDuplicates = (err) => {
//   const val = err.fields.email ? `email` : `username`;
//   return new AppError(`There's already a user with that ${val} registered on this server!`, 401);
// };

// const handleNullError = (err) => {
//   return new AppError('Username, email and password fields must not be empty!', 400);
// };

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    sendErrorProd(error, res);
  }
};

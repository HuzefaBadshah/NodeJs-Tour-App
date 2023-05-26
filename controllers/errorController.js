const AppError = require('../utils/appError');

function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

function sendErrProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log('Error 🔥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
}
function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDublicateFieldsDB(err) {
  const value = err.keyValue.name;
  return new AppError(
    `Dublicate field value ${value}. Please use another value`,
    400
  );
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError('Invalid token. Please try Log in again', 401);
}

function handleTokenExpiredError() {
  return new AppError('Your token is expired! Please login again', 401);
}

module.exports = (err, req, res, next) => {
  // console.log('error middleware: ', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('**************production: ', error);
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (error.code === 11000) {
      error = handleDublicateFieldsDB(err);
    }
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDB(err);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }
    sendErrProd(error, res);
  }
};

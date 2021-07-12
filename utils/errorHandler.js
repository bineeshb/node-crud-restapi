const errorHandler = error => {
  const { code, message } = error;
  console.error(code, message);
  let statusCode = error.statusCode || 500;
  let errors = {};

  if (code === 11000) {
    const duplicateValuesIn = error.keyPattern && typeof error.keyPattern === 'object'
      ? `for the keys: ${Object.keys(error.keyPattern).join()}`
      : '';
    statusCode = 400;
    errors.message = `Duplicate value in request ${duplicateValuesIn}`.trim();
  }

  if (message === 'Unauthorized' || message === 'invalid signature') {
    statusCode = 401;
    errors.message = 'User not authorized';
  }

  if (message === 'Forbidden') {
    statusCode = 403;
    errors.message = `User cannot perform this operation`;
  }

  if (message === 'Invalid Credentials') {
    statusCode = 400;
    errors.message = message;
  }

  if (message.includes('Cast to ObjectId failed')) {
    statusCode = 400;
    errors.message = 'Invalid ID in request';
  }

  if (message.includes('validation failed')) {
    statusCode = 400;
    Object.values(error.errors).forEach(({ properties: { path, message } }) => (errors[path] = message));
  }

  if (Object.keys(errors).length === 0) {
    errors.message = message || 'Server Error';
  }

  return {
    statusCode,
    errors
  };
};

const sendErrorResponse = (res, error) => {
  const { statusCode, errors } = errorHandler(error);
  res.status(statusCode).json(errors);
};

module.exports = {
  errorHandler,
  sendErrorResponse
};

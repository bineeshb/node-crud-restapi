const errorHandler = error => {
  let { code, message } = error;
  console.error(code, message);
  let statusCode = error.statusCode || 500;
  let errors = {};

  if (code === 11000) {
    message = 'duplicate value';
  } else if (message.toLowerCase().includes('cast to objectid failed')) {
    message = 'invalid id';
  } else if (message.toLowerCase().includes('validation failed')) {
    message = 'validation failed';
  }

  switch (message.toLowerCase()) {
    case 'unauthorized':
    case 'invalid signature':
      statusCode = 401;
      errors.message = 'User not authorized';
      break;

    case 'invalid credentials':
      statusCode = 400;
      errors.message = message;
      break;

    case 'forbidden':
      statusCode = 403;
      errors.message = 'User cannot perform this operation';
      break;

    case 'invalid id':
      statusCode = 400;
      errors.message = 'Invalid ID in request';
      break;

    case 'duplicate value':
      const duplicateValuesIn = error.keyPattern && typeof error.keyPattern === 'object'
        ? `for the keys: ${Object.keys(error.keyPattern).join()}`
        : '';
      statusCode = 400;
      errors.message = `Duplicate value in request ${duplicateValuesIn}`.trim();
      break;

    case 'validation failed':
      statusCode = 400;
      Object.values(error.errors).forEach(({ properties: { path, message } }) => (errors[path] = message));
      break;

    default:
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

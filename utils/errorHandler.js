const errorHandler = error => {
  const { code, message } = error;
  let statusCode = 500;
  let errors = {};

  if (code === 11000) {
    statusCode = 400;
    errors.username = 'Username already exists';
  }

  if (message === 'Unauthorized') {
    statusCode = 401;
    errors.message = 'User not authorized';
  }

  if (message === 'Invalid Credentials') {
    statusCode = 400;
    errors.message = message;
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

module.exports = errorHandler;

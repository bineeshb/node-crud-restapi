const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/errorHandler');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, err => {
        if (err) {
          throw Error('Unauthorized');
        } else {
          next();
        }
      });
    } else {
      throw Error('Unauthorized');
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = { requireAuth };

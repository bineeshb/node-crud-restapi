const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/errorHandler');
const User = require('../models/userModel');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          throw Error('Unauthorized');
        } else {
          const userId = decoded.id;
          const user = await User.findById(userId);
          req.params.user = {
            id: userId,
            role: user.role
          };
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

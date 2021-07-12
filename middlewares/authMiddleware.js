const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/errorHandler');
const User = require('../models/userModel');

const requireAuth = (validRoles = []) => async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw Error('Unauthorized');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.id) {
      throw Error('Unauthorized');
    }

    const userId = decoded.id;
    const user = await User.findById(userId);

    if (validRoles.length > 0 && !validRoles.some(role => role === user.role)) {
      throw Error('Forbidden');
    }

    req.params.userId = userId;
    next();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = { requireAuth };

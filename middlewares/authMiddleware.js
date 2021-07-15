const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/errorHandler');
const User = require('../models/userModel');

const requireAuth = (validRoles = []) => async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw Error('unauthorized');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.id) {
      throw Error('unauthorized');
    }

    const userId = decoded.id;
    const user = await User.findById(userId);

    if (validRoles.length > 0 && !validRoles.some(role => role === user.role)) {
      throw Error('forbidden');
    }

    req.params.userId = userId;
    next();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = { requireAuth };

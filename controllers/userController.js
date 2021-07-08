const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendErrorResponse } = require('../utils/errorHandler');

const tokenKey = 'jwt';
const tokenMaxAge = process.env.TOKEN_MAX_AGE * 60 * 60;
const createToken = id => {
  if (process.env.SECRET_KEY) {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: tokenMaxAge
    });
  }

  throw Error('Server Error while logging in');
};

const signupUser = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    await User.create({ name, username, password });

    res.status(201).json({
      message: 'User created successfully'
    });
  } catch(error) {
    sendErrorResponse(res, error);
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie(tokenKey, token, { httpOnly: true, maxAge: tokenMaxAge * 1000 });
    res.json({
      userName: user.name,
      role: user.role
    });
  } catch(error) {
    res.cookie(tokenKey, '', { maxAge: 1 });
    sendErrorResponse(res, error);
  }
}

const logoutUser = (req, res) => {
  res.cookie(tokenKey, '', { maxAge: 1 });
  res.json({
    message: 'User logged out successfully'
  });
};

module.exports = {
  loginUser,
  logoutUser,
  signupUser
};

const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

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
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });

    res.status(201).json({
      id: user._id
    });
  } catch(error) {
    const { statusCode, errors } = errorHandler(error);
    res.status(statusCode).json(errors);
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie(tokenKey, token, { httpOnly: true, maxAge: tokenMaxAge * 1000 });
    res.status(200).json({
      userId: user._id
    });
  } catch(error) {
    const { statusCode, errors } = errorHandler(error);
    res.cookie(tokenKey, '', { maxAge: 1 });
    res.status(statusCode).json(errors);
  }
}

const logoutUser = (req, res) => {
  res.cookie(tokenKey, '', { maxAge: 1 });
  res.status(200).json({
    message: 'User logged out'
  });
};

module.exports = { loginUser, logoutUser, signupUser };

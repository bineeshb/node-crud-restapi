const { Router } = require('express');
const { loginUser, logoutUser, signupUser } = require('../controllers/userController');

const userRouter = Router();

userRouter
  .post('/signup', signupUser)
  .post('/login', loginUser)
  .get('/logout', logoutUser);

module.exports = { userRouter };

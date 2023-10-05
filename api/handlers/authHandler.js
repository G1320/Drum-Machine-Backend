const { UserModel } = require('../../models/userModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');
const jwt = require('jsonwebtoken');

const createAndRegisterUser = handleRequest(async (req, res) => {
  const user = new UserModel(req.body);
  await user.save();
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  res.cookie('authToken', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== 'development',
    maxAge: 36000000,
    signed: true,
  });
  return { authToken: token, user: user };
});

const loginUser = handleRequest(async (req, res) => {
  const userCred = await UserModel.findOne({ username: req.body.username }).select('password');
  if (!userCred) throw new ExpressError('Invalid username', 400);

  const validPassword = await userCred.comparePassword(req.body.password);
  if (!validPassword) throw new ExpressError('Invalid password', 400);

  const user = await UserModel.findById(userCred._id);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  res.cookie('authToken', token, {
    httpOnly: true,
    signed: true,
    // secure: process.env.NODE_ENV !== 'development',
    maxAge: 36000000,
  });
  return { authToken: token, user: user };
});

const logoutUser = handleRequest(async (req, res) => {
  try {
    res.clearCookie('authToken');
    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Failed to clear authentication cookie:', error);
    throw new ExpressError('Logout failed', 500);
  }
});

module.exports = {
  createAndRegisterUser,
  loginUser,
  logoutUser,
};
